import { getUserAndOrganizationFromOAuthHeader } from "#lib/auth";
import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { UserSchema } from "prisma/generated";
import { z } from "zod";

export const GET = defineApiRoute({
	input: z.void(),
	output: UserSchema,
	async fetch(_, { request }) {
		const {user, organization} = await getUserAndOrganizationFromOAuthHeader(request.headers.get("Authorization"));

		if (!user) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid user"
			})
		}

		return user
	},
	headers: {
		Authorization: z.string()
	}
})