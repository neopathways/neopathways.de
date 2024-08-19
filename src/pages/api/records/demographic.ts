import { getAccuracyPrediction } from "#lib/AccuracyClassification";
import { ZodDemographicValidator } from "#lib/AccuracyClassification/demographic";
import { getUserAndOrganizationFromOAuthHeader } from "#lib/auth";
import { prisma } from "#lib/prisma";
import { defineApiRoute } from "astro-typesafe-api/server";
import { z } from "zod";

export const PUT = defineApiRoute({
	input: ZodDemographicValidator,
	output: z.object({
		uid: z.string(),
		validationAccuracy: z.number()
	}),
	headers: {
		"Authorization": z.string()
	},
	async fetch(input, { request }) {
		const { user, organization } = await getUserAndOrganizationFromOAuthHeader(request.headers.get("Authorization"))

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
				category: "DEMOGRAPHIC",
				tags: [],
			}
		})

		const existingRecords = await prisma.userRecord.findMany({
			where: {
				user: {
					uid: user.uid
				},
				category: "DEMOGRAPHIC"
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