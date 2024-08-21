import type { z } from "zod";
import { prisma } from "../prisma";
import type { Material } from "prisma/generated";
import type { RefTypeMap, ZodRef } from "./types";

export async function resolveServerRef<Request extends z.infer<typeof ZodRef>>(ref: Request) {
	let result: RefTypeMap[Request["$type"]] | null = null;
	if (ref.$type === "Material") {
		result = await prisma.material.findUnique({
			where: {
				uid: ref.$ref,
			}
		}) as Material | null;
	}

	return result;
}