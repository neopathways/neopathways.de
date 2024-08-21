import type { Organization, User } from "prisma/generated";
import { prisma } from "./prisma";
import { APIError } from "astro-typesafe-api/server";
import { decodeToken, encodeToken } from "./token";
import type {  AstroGlobal } from "astro";
import type { Prisma } from "@prisma/client";
import moment from "moment";

function parseHeader(header: string): {
	type: string,
	value: string
} {
	const parts = header.split(" ");

	if (parts.length !== 2) {
		throw new APIError({
			code: "BAD_REQUEST",
			message: "Invalid Authorization header"
		})
	}

	return {
		type: parts[0],
		value: parts[1]
	}
}

/**
 * Retrieves the user from a provided Bearer authorization header.
 * If the header or provided token is invalid or the user doesn't exist, this will throw an error.
 * @param authorization The Authorization header
 * @returns The user if one is found, otherwise throws an error.
 */
export async function getUserFromBearerAuthorizationHeader<UserInclude extends Prisma.UserInclude>(authorization: string, include: UserInclude = {} as UserInclude): Promise<User> | never {
	const { type, value } = parseHeader(authorization);

	if (type !== "Bearer") {
		throw new APIError({
			code: "BAD_REQUEST",
			message: "Invalid Authorization header, expected Bearer"
		})
	}

	const accessToken = decodeToken(value);
	

	if (!accessToken || !accessToken.sub || !accessToken.exp || accessToken.typ !== "access") {
		throw new APIError({
			code: "UNAUTHORIZED",
			message: "Invalid token"
		})
	}

	if (accessToken.exp < Date.now()) {
		throw new APIError({
			code: "UNAUTHORIZED",
			message: "Token expired"
		})
	}

	const user = await prisma.user.findUnique<{
		where: { uid: string },
		include: UserInclude
	}>({
		where: {
			uid: accessToken.sub as string
		},
		include
	})

	if (!user) {
		throw new APIError({
			code: "UNAUTHORIZED",
			message: "Invalid token"
		})
	}

	return user;
}

/**
 * Retrieves the user from n optionally provided Bearer authorization header.
 * If the header or provided token is invalid or the user doesn't exist, this function will return null
 * @param authorization The optional Authorization header
 * @returns The user if one is found, otherwise throws an error.
 */
export async function getUserFromOptionalBearerAuthorizationHeader<UserInclude extends Prisma.UserInclude>(authorization?: string, include: UserInclude = {} as UserInclude): Promise<User | null> {
	if (!authorization) {
		return null;
	}

	const { type, value } = parseHeader(authorization);

	if (type !== "Bearer") {
		return null;
	}

	const accessToken = decodeToken(value);
	

	if (!accessToken || !accessToken.sub || !accessToken.exp || accessToken.typ !== "access") {
		return null;
	}

	if (accessToken.exp < Date.now()) {
		return null;
	}

	const user = await prisma.user.findUnique<{
		where: { uid: string },
		include: UserInclude
	}>({
		where: {
			uid: accessToken.sub as string
		},
		include
	})

	if (!user) {
		return null;
	}

	return user;
}

export async function getUserFromAstroGlobal<UserInclude extends Prisma.UserInclude>(astro: AstroGlobal, include: UserInclude = {} as UserInclude, renewAccessToken = true) {
	const accessTokenCookie = astro.cookies.get("accessToken")
	const refreshTokenCookie = astro.cookies.get("refreshToken")

	if (!accessTokenCookie && refreshTokenCookie && renewAccessToken) {
		// Renew the access token
		const refreshToken = decodeToken(refreshTokenCookie.value);

		if (!refreshToken || !refreshToken.sub || !refreshToken.exp || refreshToken.typ !== "refresh") {
			return null;
		}

		if (refreshToken.exp < Date.now()) {
			return null;
		}

		const user = await prisma.user.findUnique<{
			where: { uid: string },
			include: UserInclude
		}>({
			where: {
				uid: refreshToken.sub as string
			},
			include
		})

		if (!user) {
			return null;
		}

		const expiry = moment().add(30, "minutes");

		const newAccessToken = encodeToken({
			typ: "access",
			sub: refreshToken.sub,
			exp: expiry.valueOf()
		})

		astro.cookies.set("accessToken", newAccessToken, {
			expires: expiry.toDate(),
			path: "/"
		})

		return user;
	}

	if (!accessTokenCookie) {
		return null;
	}

	const accessToken = decodeToken(accessTokenCookie.value);	

	if (!accessToken || !accessToken.sub || !accessToken.exp || accessToken.typ !== "access") {
		return null;
	}

	if (accessToken.exp < Date.now()) {
		return null;
	}	

	const user = await prisma.user.findUnique({
		where: {
			uid: accessToken.sub as string
		},
		include
	})

	return user;
}

export async function getUserAndOrganizationFromOAuthHeader<UserInclude extends Prisma.UserInclude, OrganizationInclude extends Prisma.OrganizationInclude>(authorization: string, userInclude: UserInclude = {} as UserInclude, organizationInclude: OrganizationInclude = {} as OrganizationInclude): Promise<{ user: User, organization: Organization }> | never {
	const { type, value } = parseHeader(authorization);

	if (type !== "Bearer") {
		throw new APIError({
			code: "BAD_REQUEST",
			message: "Invalid Authorization header, expected Bearer"
		})
	}

	const accessToken = decodeToken(value);

	if (!accessToken || !accessToken.sub || !accessToken.exp || !accessToken.organization_id || accessToken.typ !== "oauth_access") {
		throw new APIError({
			code: "UNAUTHORIZED",
			message: "Invalid token"
		})
	}

	if (accessToken.exp < Date.now()) {
		throw new APIError({
			code: "UNAUTHORIZED",
			message: "Token expired"
		})
	}

	const user = await prisma.user.findUnique<{
		where: { uid: string },
		include: UserInclude
	}>({
		where: {
			uid: accessToken.sub as string
		},
		include: userInclude
	})

	const organization = await prisma.organization.findUnique<
		{
			where: { uid: string },
			include: OrganizationInclude
		}
	>({
		where: {
			uid: accessToken.organization_id
		},
		include: organizationInclude
	})

	if (!user || !organization) {
		throw new APIError({
			code: "UNAUTHORIZED",
			message: "Invalid token"
		})
	}

	return { user, organization };
}