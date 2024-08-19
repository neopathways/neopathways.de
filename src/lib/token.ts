import jwt from "jsonwebtoken"

export type TokenOptions = {
	// The uid of the user this token was created for.
	sub: string,
	// The type of token this is.
	typ: "access" | "refresh" | "authorization_code" | "oauth_refresh" | "oauth_access",
	// The expiry date of the token.
	exp: number,
	// The scopes of the token.
	scopes?: string[],
	// The organization ID of the organization this token was created for.
	organization_id?: string
}

export function encodeToken<T extends TokenOptions>(payload: T): string {
	return jwt.sign({
		...payload,
		iat: Date.now()
	}, process.env.JWT_SECRET as string, {
		algorithm: "HS256"
	})
}

export function decodeToken<T = Partial<TokenOptions>>(token: string): T | null {
	try {
		return jwt.verify(token, process.env.JWT_SECRET as string, {
			algorithms: ["HS256"]
		}) as T
	} catch(e) {
		return null
	}
}