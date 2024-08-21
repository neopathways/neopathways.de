import type { z } from "zod";
import type { RefTypeMap, ZodRef } from "./types";
import { api } from "astro-typesafe-api/client";

export async function resolveClientRef<Request extends z.infer<typeof ZodRef>>(ref: Request) {
	let result: RefTypeMap[Request["$type"]] | null = null;
	if (ref.$type === "Material") {
		result = await api.materials.GET.fetch(ref);
	}

	return result;
}