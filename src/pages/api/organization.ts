import { APIError, defineApiRoute } from "astro-typesafe-api/server";
import { OrganizationSchema } from "prisma/generated";
import { z } from "zod";
import { prisma } from "#lib/prisma"
import { getUserFromBearerAuthorizationHeader } from "#lib/auth"

export const PUT = defineApiRoute({
	input: OrganizationSchema.omit({
		created: true,
		uid: true,
		updated: true,
		ownerId: true
	}),
	output: z.object({
		uid: z.string()
	}),
	headers: {
		Authorization: z.string()
	},
	async fetch(input, { request }) {
		const user = await getUserFromBearerAuthorizationHeader(request.headers.get("Authorization"))
		// Check if the organization already exists
		const existing = await prisma.organization.findUnique({
			where: {
				name: input.name
			}
		})

		if (existing) {
			throw new APIError({
				code: "CONFLICT",
				message: "Organization already exists"
			})
		}		

		const organization = await prisma.organization.create({
			data: {
				name: input.name,
				owner: {
					connect: {
						uid: user.uid
					}
				},
				redirecturl: input.redirecturl
			}
		})

		const member = await prisma.organizationMember.create({
			data: {
				role: "OWNER",
				organization: {
					connect: {
						uid: organization.uid
					}
				},
				user: {
					connect: {
						uid: user.uid
					}
				}
			}
		})

		return {
			uid: organization.uid
		}
	}
})

export const POST = defineApiRoute({
	meta: {
		description: "Update an existing organization"
	},
	input: OrganizationSchema.omit({
		created: true,
		updated: true,
		ownerId: true
	}),
	output: z.object({
		uid: z.string()
	}),
	headers: {
		Authorization: z.string()
	},
	async fetch(input, { request }) {
		const user = await getUserFromBearerAuthorizationHeader(request.headers.get("Authorization"))

		// Check if the organization already exists
		const organization = await prisma.organization.findUnique({
			where: {
				uid: input.uid
			}
		})

		if (!organization || organization.ownerId !== user.uid) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Organization does not exist or doesn't belong to this user."
			})
		}

		await prisma.organization.update({
			where: {
				uid: input.uid
			},
			data: {
				name: input.name,
				redirecturl: input.redirecturl,
				description: input.description
			}
		})

		return {
			uid: organization.uid
		}
	}
})

export const DELETE = defineApiRoute({
	meta: {
		description: "Delete an existing organization - this only works if no connections were established."
	},
	input: OrganizationSchema.pick({
		uid: true
	}),
	output: z.object({
		uid: z.string()
	}),
	headers: {
		Authorization: z.string()
	},
	async fetch(input, { request }) {
		const user = await getUserFromBearerAuthorizationHeader(request.headers.get("Authorization"))

		// Check if the organization already exists
		const organization = await prisma.organization.findUnique({
			where: {
				uid: input.uid
			},
			include: {
				_count: {
					select: {
						oAuthConnections: true
					}
				}
			}
		})

		if (!organization || organization.ownerId !== user.uid) {
			throw new APIError({
				code: "BAD_REQUEST",
				message: "Organization does not exist or doesn't belong to this user."
			})
		}

		if (organization._count.oAuthConnections > 0) {
			throw new APIError({
				code: "CONFLICT",
				message: "Organizations may not be deleted if they still have connections established with them. Please delete the connections first."
			})
		}

		await prisma.organizationMember.deleteMany({
			where: {
				organization: {
					uid: organization.uid
				}
			}
		})

		await prisma.organization.delete({
			where: {
				uid: organization.uid
			}
		})

		return {
			uid: organization.uid
		}
	}
})