import { prisma } from "#lib/prisma";
import { ZodRef } from "#lib/refs/types";
import { defineApiRoute } from "astro-typesafe-api/server";
import { MaterialSchema } from "prisma/generated";
import { z } from "zod";
import crypto from "crypto";
import { getUserFromBearerAuthorizationHeader, getUserFromOptionalBearerAuthorizationHeader } from "#lib/auth";
import type { Prisma } from "@prisma/client";

export const GET = defineApiRoute({
	async fetch(input, { request }) {
		const { $ref } = input;
		
		const result = await prisma.material.findUnique({
			where: {
				uid: $ref,
			}
		});

		return result;
	},
	input: ZodRef.pick({ "$ref": true }),
	output: z.union([z.any(), z.null()])
})

export const PUT = defineApiRoute({
	async fetch(input, { request }) {
		const user = await getUserFromOptionalBearerAuthorizationHeader(request.headers.get("Authorization"));

		// Generate a sha512 hash of the input object
		const hash = crypto.createHash("sha512").update(JSON.stringify(input)).digest("hex");
		
		const existing = await prisma.material.findFirst({
			where: {
				sha512: hash,
			}
		})

		if (existing) {
			return { "$ref": existing.uid };
		}

		const data: Prisma.MaterialCreateInput = {
			...input,
			sha512: hash,
		}

		if (user) {
			data.user = {
				connect: {
					uid: user.uid,
				}
			}
		}

		const result = await prisma.material.create({
			data
		});

		return { "$ref": result.uid };
	},
	input: MaterialSchema.omit({ uid: true, sha512: true, created: true, updated: true, useruid: true }),
	output: z.object({
		"$ref": z.string(),
	}),
	headers: {
		"Authorization": z.string().optional(),
	}
})