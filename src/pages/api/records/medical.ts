import { getAccuracyPrediction } from "#lib/AccuracyClassification";
import { getUserAndOrganizationFromOAuthHeader } from "#lib/auth";
import { prisma } from "#lib/prisma";
import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { z } from "zod";
import { DentalTherapySchema, MaterialSchema, TransactionSchema, type DentalTherapy } from "prisma/generated";
import { ZodRef } from "#lib/refs/types";

const dbGeneratedFields: { uid: true, created: true, updated: true, sha512: true} = {
	uid: true,
	created: true,
	updated: true,
	sha512: true,
}

function isRef(obj: any): obj is z.infer<typeof ZodRef> {
	return obj && "$ref" in obj && "$type" in obj;
}

export const PUT = defineApiRoute({
	input: DentalTherapySchema.omit(dbGeneratedFields).merge(z.object({
		materialsUsed: z.array(z.union([ZodRef, MaterialSchema.omit(dbGeneratedFields)])).optional(),
		transactions: z.array(z.union([ZodRef, TransactionSchema.omit(dbGeneratedFields)])).optional()
	})),
	output: z.object({
		uid: z.string(),
		validationAccuracy: z.number()
	}),
	headers: {
		"Authorization": z.string()
	},
	async fetch(input, { request }) {
		const { user, organization } = await getUserAndOrganizationFromOAuthHeader(request.headers.get("Authorization"))

		// Validate the input refs
		if (input.materialsUsed) {
			const refs = input.materialsUsed.filter(isRef);

			const materials = await prisma.material.findMany({
				where: {
					uid: {
						in: refs.map((material) => material.$ref)
					}
				}
			})

			if (materials.length !== input.materialsUsed.length) {
				const unresolved = refs.filter((ref) => !materials.find((material) => material.uid === ref.$ref))
				throw new APIError({
					code: "BAD_REQUEST",
					message: "Unkown material reference",
					details: unresolved
				})
			}

			const toCreate = input.materialsUsed.filter((material) => !isRef(material))

			const createdMaterials = await prisma.material.createManyAndReturn({
				data: toCreate
			})

			input.materialsUsed = [...materials, ...createdMaterials]
		}

		const record = await prisma.userRecord.create({
			data: {
				organization: {
					connect: {
						uid: organization.uid
					}
				},
				user: {
					connect: {
						uid: user.uid
					}
				},
				data: input,
				accuracy: 0,
				category: "MEDICAL",
				tags: ["DENTAL"],
			}
		})

		const existingRecords = await prisma.userRecord.findMany({
			where: {
				user: {
					uid: user.uid
				},
				category: "MEDICAL"
			}
		})

		// Calculate the accuracy based on the existing records
		let accuracies: ReturnType<typeof getAccuracyPrediction> = [];
		try {
			accuracies = getAccuracyPrediction(record, existingRecords);

			// If something went wrong, just return the record
			if (accuracies) {
				await prisma.$transaction(accuracies.map((accuracy) => {
					return prisma.userRecord.update({
						where: {
							uid: accuracy.uid
						},
						data: {
							accuracy: accuracy.accuracy
						}
					})
				}))
			}
		} catch(e) {
			return {
				validationAccuracy: 0,
				uid: record.uid
			}
		}

		return {
			validationAccuracy: accuracies?.find((accuracy) => accuracy.uid === record.uid)?.accuracy || 0,
			uid: record.uid
		}
	}
})