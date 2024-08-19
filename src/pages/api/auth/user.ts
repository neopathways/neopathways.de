import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { z } from "zod";
import { prisma } from "#lib/prisma"
import { hashPassword } from "#lib/password"
import { UserSchema } from "prisma/generated";

export const PUT = defineApiRoute({
	input: UserSchema.omit({
		created: true,
		uid: true,
		updated: true,
	}),
	output: z.object({
		uid: z.string()
	}),
	async fetch(input, { request }) {
		const user = await prisma.user.findUnique({
			where: {
				email: input.email
			}
		})

		if (user) {
			throw new APIError({
				code: "CONFLICT",
				message: "User already exists"
			})
		}

		const newUser = await prisma.user.create({
			data: {
				email: input.email,
				firstname: input.firstname,
				lastname: input.lastname,
				password: hashPassword(input.password)
			}
		})

		return {
			uid: newUser.uid
		}
	}
})

export const GET = defineApiRoute({
	input: z.object({
		uid: z.string()
	}),
	output: UserSchema,
	fetch: async (input, { request }) => {
		const user = await prisma.user.findUnique({
			where: {
				uid: input.uid
			}
		})

		if (!user) {
			throw new APIError({
				code: "NOT_FOUND",
				message: "User not found"
			})
		}

		return user;
	}
})