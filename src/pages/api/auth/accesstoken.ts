import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { z } from "zod";
import { prisma } from "#lib/prisma"
import { encodeToken } from "#lib/token"
import moment from "moment";


export const GET = defineApiRoute({
	input: z.void(),
	output: z.object({
		accessToken: z.string(),
		expiry: z.number()
	}),
	headers: {
		Authorization: z.string()
	},
	async fetch(_, { request }) {
		const authorization = request.headers.get("Authorization");
		if (!authorization) {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "No authorization header provided"
			})
		}

		const [type, token] = authorization.split(" ")

		if (type !== "Bearer") {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "Only Bearer authorization is supported"
			})
		}

		const refreshToken = await prisma.refreshToken.findUnique({
			where: {
				token
			}
		})

		if (!refreshToken) {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "Invalid refresh token"
			})
		}
		const expiry = moment().add(30, "minutes").valueOf()

		const accessToken = encodeToken({
			sub: refreshToken.useruid,
			typ: "access",
			exp: expiry
		})

		return {
			accessToken,
			expiry
		}
	}
})