import type { $Enums, UserRecord } from "@prisma/client";
import { z, type ZodSchema } from "zod";
import { ZodDemographicValidator } from "./demographic";
import { ZodLocationValidator } from "./location";
import { ZodMedicalCondition } from "./medical/types";

export const ZodValidatorMap: Record<$Enums.RecordCategory, ZodSchema> = {
	BEHAVIORAL: z.object({}),
	BIOGRAPHICAL: z.object({}),
	BIOMETRIC: z.object({}),
	COMMUNICATION: z.object({}),
	DEMOGRAPHIC: ZodDemographicValidator,
	FINANCIAL: z.object({}),
	IDENTIFICATION: z.object({}),
	INTERACTION: z.object({}),
	INTERESTS: z.object({}),
	LEGAL: z.object({}),
	LOCATION: ZodLocationValidator,
	MEDICAL: z.object({
		medicalConditions: z.array(ZodMedicalCondition)
	}),
	ONLINE_ACTIVITY: z.object({}),
	OTHER: z.record(z.string(), z.any()),
	PREFERENCES: z.object({}),
	PSYCHOLOGICAL: z.object({}),
};


