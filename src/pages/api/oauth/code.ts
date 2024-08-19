import { getUserFromBearerAuthorizationHeader } from "#lib/auth";
import { prisma } from "#lib/prisma";
import { decodeToken, encodeToken } from "#lib/token";
import { Scope, type OAuthCode } from "#types/oauth";
import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { z } from "astro:content";
import moment from "moment";

export const GET = defineApiRoute({
	input: z.object({
		client_id: z.string(),
		scopes: z.array(z.string()),
		redirect_uri: z.string()
	}),
	output: z.object({
		code: z.string()
	}),
	async fetch(input, {request}) {
		const user = await getUserFromBearerAuthorizationHeader(request.headers.get("Authorization"));

		// Check if the organization exists
		const organization = await prisma.organization.findUnique({
			where: {
				uid: input.client_id
			}
		})

		if (!organization) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid organization"
			})
		}
		

		const expiry = moment().add(5, "minutes").valueOf();

		// Make sure the scopes are valid
		if (input.scopes.some(scope => !Object.values(Scope).includes(scope as Scope))) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid scope"
			})
		}

		// Make sure a connection doesn't exist already with the same scopes defined.
		const connection = await prisma.oAuthConnection.findFirst({
			where: {
				user: {
					uid: user.uid
				},
				organization: {
					uid: organization.uid
				}
			}
		})

		if (connection) {
			// If the scopes are not exactly the same as last time, update the connection.
			if (!connection.scopes.reduce((acc, scope) => acc && input.scopes.includes(scope), true)) {
				await prisma.oAuthConnection.update({
					where: {
						uid: connection.uid
					},
					data: {
						scopes: {
							set: input.scopes
						}
					}
				})
			}
		} else {
			await prisma.oAuthConnection.create({
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
					scopes: input.scopes
				}
			})
		}

		// The auth code needs to be created and returned anyway in case the refresh token has run out on the other organization.
		const code = encodeToken<OAuthCode>({
			sub: user.uid,
			typ: "authorization_code",
			scopes: input.scopes,
			organization_id: input.client_id,
			redirect_uri: input.redirect_uri,
			exp: expiry
		})

		return {
			code
		}
	}
})