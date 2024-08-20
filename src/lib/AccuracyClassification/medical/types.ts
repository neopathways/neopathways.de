import { url } from "dist/client/_astro/client-integration.CQXCHKmh";
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

export const ZodTransactionAmount = z.object({
	amount: z.number().describe("The transaction amount."),
	currency: z.string().describe("The currency used in the transaction."),
	tax: z.number().optional().describe("The tax amount in percent."),
	taxIncluded: z.boolean().optional().describe("Whether the tax is included in the transaction."),
	date: z.date().optional().describe("The date of the transaction."),
	type: z.string().optional().describe("The type of transaction as in cash/credit/transfer..."),
})

export const ZodMaterial = z.object({
	name: z.string().describe("The name of the material."),
	quantity: z.string().describe("The quantity of the material."),
	type: z.string().describe("The type of material."),
	url: z.string().optional().describe("A URL to the material."),
	weight: z.string().optional().describe("The weight of the material."),
	description: z.string().optional().describe("A description of the material."),
	price: ZodTransactionAmount.optional().describe("The price of the material."),
})

export const ZodDentalTherapy = z.object({
	affectedTeeth: z.array(z.number()).describe("The teeth that were affected by the treatment."),
	dentalTreatmentType: z.string().describe("The type of dental treatment."),
	materialsUsed: z.array(ZodMaterial).optional().describe("The materials used in the treatment."),
	treatmentDescription: z.string().optional().describe("A description of the treatment."),
	treatmentCost: ZodTransactionAmount.optional().describe("The cost of the treatment.")
});

export const ZodMedicalTherapy = z.object({
	
});