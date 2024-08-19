import { prisma } from "#lib/prisma";
import { encodeToken } from "#lib/token";
import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import moment from "moment";
import { z } from "zod";

export const GET = defineApiRoute({
	input: z.void(),
	output: z.object({
		accessToken: z.string(),
		refreshToken: z.string()
	}),
	headers: {
		"Authorization": z.string()
	},
	async fetch(input, { request }) {
		const authorization = request.headers.get("Authorization");

		const [method, refreshToken] = authorization.split(" ");

		if (method !== "Bearer") {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid Authorization header"
			})
		}

		if (!refreshToken) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Missing refresh token"
			})
		}

		// Validate the refresh token

		const token = await prisma.oAuthRefreshToken.findUnique({
			where: {
				token: refreshToken
			}
		})

		if (!token) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid refresh token"
			})
		}

		// Delete the refresh token
		await prisma.oAuthRefreshToken.delete({
			where: {
				token: refreshToken
			}
		})

		const newRefreshTokenJwt = encodeToken({
			typ: "oauth_refresh",
			sub: token.useruid,
			exp: moment().add("30", "days").valueOf(),
			organization_id: token.orguid,
			scopes: ["full"]
		})

		// Create a new refresh token and access token
		const newRefreshToken = await prisma.oAuthRefreshToken.create({
			data: {
				token: newRefreshTokenJwt,
				user: {
					connect: {
						uid: token.useruid
					}
				},
				organization: {
					connect: {
						uid: token.orguid
					}
				},
				validUntil: moment().add("30", "days").toDate()
			}
		})

		const accessToken = encodeToken({
			typ: "oauth_access",
			sub: token.useruid,
			exp: moment().add("30", "minutes").valueOf(),
			organization_id: token.orguid,
			scopes: ["full"]
		})

		return {
			accessToken,
			refreshToken: newRefreshTokenJwt
		}
	}
})