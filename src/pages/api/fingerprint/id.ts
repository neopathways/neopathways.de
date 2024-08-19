import { defineApiRoute } from "astro-typesafe-api/server";
import { z } from "astro:content";

// Creates a digital fingerprint of the requested user
export const GET = defineApiRoute({
	fetch(input, {request}) {
		const fingerprint = request.headers.get("user-agent") + request.headers.get("accept-language") + request.headers.get("accept-encoding") + request.headers.get("accept-charset")

		return {
			fingerprint
		}
	},
	input: z.object({
		uid: z.string()
	}),
	output: z.object({
		fingerprint: z.string()
	})
})