import { prisma } from "#lib/prisma";
import { decodeToken, encodeToken } from "#lib/token";
import type { OAuthCode } from "#types/oauth";
import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import moment from "moment";
import { z } from "zod";

export const GET = defineApiRoute({
	input: z.object({
		code: z.string().describe("This parameter is the authorization code that the client previously received from the authorization server."),
		grant_type: z.enum(["authorization_code"]),
		redirect_uri: z.string().optional().describe("If the redirect URI was included in the initial authorization request, the service must require it in the token request as well. The redirect URI in the token request must be an exact match of the redirect URI that was used when generating the authorization code. The service must reject the request otherwise."),
		code_verifier: z.string().optional().describe("If the client included a code_challenge parameter in the initial authorization request, it must now prove it has the secret used to generate the hash by sending it in the POST request. This is the plaintext string that was used to calculate the hash that was previously sent in the code_challenge parameter."),
		client_id: z.string().optional().describe("The client ID that was issued to the client when it was registered."),
	}),
	output: z.object({
		refreshToken: z.string()
	}),
	async fetch(input, { request }) {
		const code = decodeToken<OAuthCode>(input.code)

		if (!code) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid oAuth Code"
			})
		}

		if (!code.sub || !code.organization_id || (code.organization_id !== input.client_id) || (code.typ !== "authorization_code")) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid oAuth Code"
			})
		}

		if (code.exp < Date.now()) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Expired oAuth Code"
			})
		}
		

		const expiry = moment().add(30, "days")

		const newRefreshTokenJwt = encodeToken({
			typ: "oauth_refresh",
			sub: code.sub,
			organization_id: code.organization_id,
			exp: expiry.valueOf(),
			scopes: code.scopes
		})

		// Create a new refresh token and access token
		const newRefreshToken = await prisma.oAuthRefreshToken.create({
			data: {
				token: newRefreshTokenJwt,
				user: {
					connect: {
						uid: code.sub
					}
				},
				organization: {
					connect: {
						uid: code.organization_id
					}
				},
				validUntil: expiry.toDate()
			}
		})

		return {
			refreshToken: newRefreshTokenJwt
		}
	}
})