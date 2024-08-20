import { z } from "zod";

export type AnatomicalSystem = {};
export type AnatomicalStructure = {
	associatedPathophysiology: string;
	bodyLocation: string;
	connectedTo?: AnatomicalStructure[];
	diagram: string;
	partOfSystem: AnatomicalSystem;
	relatedCondition?: MedicalCondition[];
	relatedTherapy?: MedicalTherapy[];
	subStructure?: AnatomicalStructure;
};

export type MedicalCondition = {
	associatedAnatomy: AnatomicalStructure | AnatomicalSystem;
};

export type MedicalTherapy = {};

// Pulled from https://schema.org/MedicalEntity
export const ZodAnatomicalSystem = z.object({});

export const ZodAnatomicalStructure: z.ZodType<AnatomicalStructure> = z.object({
	associatedPathophysiology: z.string(),
	bodyLocation: z.string(),
	connectedTo: z.array(z.lazy(() => ZodAnatomicalStructure)).optional(),
	// TODO: ZodImageObject
	diagram: z.string(),
	partOfSystem: ZodAnatomicalSystem,
	relatedCondition: z
		.array(z.lazy<typeof ZodMedicalCondition>(() => ZodMedicalCondition))
		.optional(),
	relatedTherapy: z
		.array(z.lazy<typeof ZodMedicalTherapy>(() => ZodMedicalTherapy))
		.optional(),
	subStructure: z
		.lazy<typeof ZodAnatomicalStructure>(() => ZodAnatomicalStructure)
		.optional(),
});

export const ZodMedicalCondition = z.object({
	associatedAnatomy: z.union([ZodAnatomicalStructure, ZodAnatomicalSystem]),
});

export const ZodMedicalTherapy = z.object({});
