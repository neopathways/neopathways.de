import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { z } from "zod";
import { prisma } from "#lib/prisma"
import { hashPassword } from "#lib/password"
import { decodeToken, encodeToken } from "#lib/token"
import moment from "moment";

export const GET = defineApiRoute({
	input: z.void(),
	output: z.object({
		refreshToken: z.string(),
		expiry: z.number()
	}),
	headers: {
		Authorization: z.string()
	},
	async fetch(_, { request, clientAddress }) {
		const authorization = request.headers.get("Authorization")
		if (!authorization) {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "No authorization header provided"
			})
		}

		const [type, credentials] = authorization.split(" ")
		if (type !== "Basic") {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "Only Basic authorization is supported"
			})
		}

		const [email, password] = Buffer.from(credentials, "base64").toString().split(":")
		const user = await prisma.user.findUnique({
			where: {
				email
			}
		})

		if (!user) {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "Invalid email or password"
			})
		}

		if (user.password !== hashPassword(password)) {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "Invalid email or password"
			})
		}

		const expiry = moment().add(30, "days")

		const refreshToken = encodeToken({
			sub: user.uid,
			typ: "refresh",
			exp: expiry.valueOf()
		})

		await prisma.refreshToken.create({
			data: {
				token: refreshToken,
				user: {
					connect: {
						uid: user.uid
					}
				},
				validUntil: expiry.toDate(),
				agent: request.headers.get("User-Agent") || "",
				ip: clientAddress
			}
		})

		return {
			refreshToken,
			expiry: expiry.valueOf()
		}
	}
})

export const DELETE = defineApiRoute({
	headers: {
		Authorization: z.string()
	},
	async fetch({ uid }, { request }) {
		const authorization = request.headers.get("Authorization")
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

		const data = decodeToken(token)

		if (!data || data.typ !== "refresh") {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "Invalid token type"
			})
		}

		const deleteToken = await prisma.refreshToken.findUnique({
			where: {
				uid
			},
			include: {
				user: true
			}
		})

		if (deleteToken?.user.uid !== data.sub) {
			throw new APIError({
				code: "UNAUTHORIZED",
				message: "This token does not belong to the currently authorized user."
			})
		}

		await prisma.refreshToken.delete({
			where: {
				uid
			}
		})

		return {
			uid
		}
	},
	input: z.object({
		uid: z.string()
	}),
	output: z.object({
		uid: z.string()
	})
})