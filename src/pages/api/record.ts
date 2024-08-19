import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { OrganizationSchema, UserRecordSchema } from "prisma/generated";
import { z, ZodIssueCode } from "zod";
import { prisma } from "#lib/prisma";
import { getUserFromBearerAuthorizationHeader } from "#lib/auth";
import type { Prisma } from "@prisma/client";

export const PUT = defineApiRoute({
	input: UserRecordSchema.omit({
		created: true,
		uid: true,
		updated: true,
		outdated: true,
		useruid: true,
	}),
	output: z.object({
		uid: z.string(),
	}),
	headers: {
		Authorization: z.string(),
	},
	async fetch(input, { request }) {
		const user = await getUserFromBearerAuthorizationHeader(request.headers.get("Authorization"));
		// Check if the organization already exists
		const organization = await prisma.organization.findUnique({
			where: {
				uid: input.orguid,
			},
		});

		if (!organization) {
			throw new APIError({
				code: "NOT_FOUND",
				message: "Organization not found",
			});
		}

		const record = await prisma.userRecord.create({
			data: {
				category: input.category,
				data: input.data ?? {},
				organization: {
					connect: {
						uid: input.orguid,
					},
				},
				tags: input.tags,
				user: {
					connect: {
						uid: user.uid,
					},
				},
				accuracy: 0.5,
			},
		});

		return {
			uid: record.uid,
		};
	},
});

const parseJsonPreprocessor = (value: any, ctx: z.RefinementCtx) => {
	if (typeof value === "string") {
		try {
			return JSON.parse(value);
		} catch (e) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: (e as Error).message,
			});
		}
	}

	return value;
};

const RecordFilter = UserRecordSchema.pick({
	tags: true,
	category: true,
})
	.merge(
		z.object({
			tags: z.preprocess(
				parseJsonPreprocessor,
				UserRecordSchema.shape.tags
			),
			orguid: z.string(),
			take: z.number().max(50).default(10),
			skip: z.number().default(0),
		})
	)
	.partial();

export const GET = defineApiRoute({
	input: RecordFilter,
	output: z.object({
		count: z.number(),
		records: z.array(UserRecordSchema.merge(z.object({
			organization: OrganizationSchema
		})))
	}),
	headers: {
		Authorization: z.string(),
	},
	async fetch(input, { request }) {
		const user = await getUserFromBearerAuthorizationHeader(
			request.headers.get("Authorization")
		);

		const where: Prisma.UserRecordWhereInput = {
			user: {
				uid: user.uid,
			},
			organization: {
				uid: input.orguid
			}
		}

		if (input.category) {
			where.category = input.category;
		}

		const count = await prisma.userRecord.count({
			where
		})

		const records = await prisma.userRecord.findMany({
			where,
			include: {
				organization: true
			},
			orderBy: {
				created: "desc"
			},
			take: input.take,
			skip: input.skip,
		});

		return {
			count,
			records
		};
	},
});
