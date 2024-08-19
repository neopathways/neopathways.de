import type { TokenOptions } from "#lib/token";

export enum Scope {
	READ = "read",
	WRITE = "write",
	DELETE = "delete",
	FULL = "full",
	LOCATION_READ = "location:read",
	LOCATION_WRITE = "location:write",
	LOCATION_DELETE = "location:delete",
	LOCATION_FULL = "location:full",
}

export interface OAuthCode extends TokenOptions {
	organization_id: string,
	exp: number,
	redirect_uri: string
}