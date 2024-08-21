import type { ZodHolding } from "#lib/types/financial";
import type { Material } from "prisma/generated";
import { z } from "zod";

export type RefTypeMap = {
	Material: Material;
	Holding: z.infer<typeof ZodHolding>
}

export const ZodRef = z.object({
	"$ref": z.string().cuid2().describe("The reference to the object as a CUID."),
	"$type": z.string().describe("The type of the object."),
})

export function createZodRef(type: string) {
	return ZodRef.merge(z.object({
		"$type": z.enum([type]).describe("The type of the object."),
	}));
}