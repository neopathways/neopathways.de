import { getAccuracyPrediction } from "#lib/AccuracyClassification";
import { ZodLocationValidator } from "#lib/AccuracyClassification/location";
import { getUserAndOrganizationFromOAuthHeader } from "#lib/auth";
import { prisma } from "#lib/prisma";
import type { UserRecord } from "@prisma/client";
import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { UserRecordSchema } from "prisma/generated";
import { z } from "zod";

export const GET = defineApiRoute({
	input: z.object({
		uid: z.string()
	}),
	output: UserRecordSchema.merge(z.object({
		data: ZodLocationValidator
	})),
	headers: {
		"Authorization": z.string()
	},
	async fetch(input, { request }) {
		const { user, organization } = await getUserAndOrganizationFromOAuthHeader(request.headers.get("Authorization"))

		const record = await prisma.userRecord.findUnique({
			where: {
				uid: input.uid,
				user: {
					uid: user.uid
				}
			}
		})

		if (!record) {
			throw new APIError({
				code: "NOT_FOUND",
				message: "Record not found"
			})
		}

		return record as UserRecord & { data: z.infer<typeof ZodLocationValidator> }
	}
})