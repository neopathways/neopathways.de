import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { z } from "zod";
import { prisma } from "#lib/prisma"
import { getUserAndOrganizationFromOAuthHeader, getUserFromBearerAuthorizationHeader } from "#lib/auth"
import * as fs from "fs"
import { fileTypeFromBuffer } from "file-type";

export const PUT = defineApiRoute({
	input: z.object({
		file: z.string(),
		name: z.string(),
		description: z.string(),
		encoding: z.string(),
		mimetype: z.string()
	}),
	output: z.object({
		uid: z.string()
	}),
	headers: {
		Authorization: z.string()
	},
	async fetch(input, { request }) {
		const {user, organization} = await getUserAndOrganizationFromOAuthHeader(request.headers.get("Authorization"));

		// Make sure the file has the correct encoding
		if (input.encoding !== "base64") {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid encoding"
			})
		}

		// Decode the file and check the mimetype
		const file = Buffer.from(input.file, "base64");
		const fileType = await fileTypeFromBuffer(file);

		// Make sure the mime type corresponds to an image
		if (!fileType?.mime.startsWith("image/")) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid mimetype"
			})
		}

		// Make sure the mime type corresponds to the one provided by the request
		if (fileType?.mime !== input.mimetype) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Invalid mimetype"
			})
		}

		// Write the file to the persistent storage
		const filename = `uploads/${input.name}`;
		fs.writeFileSync
		(
			filename,
			file
		);

		// Create the upload record in the database
		const upload = await prisma.upload.create({
			data: {
				encoding: input.encoding,
				mimetype: input.mimetype,
				filename: input.name,
				description: input.description,
				user: {
					connect: {
						uid: user.uid
					}
				},
				organization: {
					connect: {
						uid: organization.uid
					}
				}
			}
		})

		return {
			uid: upload.uid
		}
	}
})