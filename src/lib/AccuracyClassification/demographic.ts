import { z } from "zod";
import type { UserRecord } from "@prisma/client";
import { ContributionAdjustedAccumulator, EnumAccumulator, normalizeUsingWeightedKeys } from "./math";
import { createWeightedAccuracyPredictorObject } from "./predictor";

export const ZodDemographicValidator = z.object({
	age: z.number().int().positive().optional().nullable(),
	gender: z.enum(['male', 'female', 'non-binary', 'other', 'prefer_not_to_say']).optional().nullable(),
	ethnicity: z.string().optional().nullable(),
	maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional().nullable(),
	educationLevel: z.enum(['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'other']).optional().nullable(),
	occupation: z.string().optional().nullable(),
	incomeRange: z.enum(['<20k', '20k-40k', '40k-60k', '60k-80k', '80k-100k', '100k-150k', '150k+']).optional().nullable(),
	residenceType: z.enum(['urban', 'suburban', 'rural']).optional().nullable(),
	language: z.string().optional().nullable(),
	nationality: z.string().optional().nullable(),
	// Additional Fields
	religion: z.string().optional().nullable(), // Religion or belief system
	householdSize: z.number().int().positive().optional().nullable(), // Number of people in the household
	housingStatus: z.enum(['own', 'rent', 'other']).optional().nullable(), // Housing status
	disabilityStatus: z.enum(['yes', 'no', 'prefer_not_to_say']).optional().nullable(), // Disability status
});

export type DemographicUserRecord = Omit<UserRecord, "data"> & {
	data: z.infer<typeof ZodDemographicValidator>
}


export const demographicAccuracyCalculation = createWeightedAccuracyPredictorObject({
	base: () => ({
		age: new ContributionAdjustedAccumulator(),
		gender: new EnumAccumulator<typeof ZodDemographicValidator.shape.gender>(),
		maritalStatus: new EnumAccumulator<typeof ZodDemographicValidator.shape.maritalStatus>,
		educationLevel: new EnumAccumulator<typeof ZodDemographicValidator.shape.educationLevel>,
		incomeRange: new EnumAccumulator<typeof ZodDemographicValidator.shape.incomeRange>,
		residenceType: new EnumAccumulator<typeof ZodDemographicValidator.shape.residenceType>,
		language: new EnumAccumulator<typeof ZodDemographicValidator.shape.language>,
		nationality: new EnumAccumulator<typeof ZodDemographicValidator.shape.nationality>,
		religion: new EnumAccumulator<typeof ZodDemographicValidator.shape.religion>,
		householdSize: new ContributionAdjustedAccumulator(),
		housingStatus: new EnumAccumulator<typeof ZodDemographicValidator.shape.housingStatus>,
		disabilityStatus: new EnumAccumulator<typeof ZodDemographicValidator.shape.disabilityStatus>
	}),
	accumulator: (previousValue, currentValue, index, array) => {
		return {
			age: previousValue.age.accumulate(currentValue.age),
			gender: previousValue.gender.accumulate(currentValue.gender),
			maritalStatus: previousValue.maritalStatus.accumulate(currentValue.maritalStatus),
			educationLevel: previousValue.educationLevel.accumulate(currentValue.educationLevel),
			incomeRange: previousValue.incomeRange.accumulate(currentValue.incomeRange),
			residenceType: previousValue.residenceType.accumulate(currentValue.residenceType),
			language: previousValue.language.accumulate(currentValue.language),
			nationality: previousValue.nationality.accumulate(currentValue.nationality),
			religion: previousValue.religion.accumulate(currentValue.religion),
			householdSize: previousValue.householdSize.accumulate(currentValue.householdSize),
			housingStatus: previousValue.housingStatus.accumulate(currentValue.housingStatus),
			disabilityStatus: previousValue.disabilityStatus.accumulate(currentValue.disabilityStatus)
		}
	},
	average: (accumulated, length) => {
		return {
			age: accumulated.age,
			gender: accumulated.gender,
			maritalStatus: accumulated.maritalStatus,
			educationLevel: accumulated.educationLevel,
			incomeRange: accumulated.incomeRange,
			residenceType: accumulated.residenceType,
			language: accumulated.language,
			nationality: accumulated.nationality,
			religion: accumulated.religion,
			householdSize: accumulated.householdSize,
			housingStatus: accumulated.housingStatus,
			disabilityStatus: accumulated.disabilityStatus
		}
	},
	predictor: (dataset, weightedAverage, weight = 1) => {
		return normalizeUsingWeightedKeys<Record<keyof typeof weightedAverage, number>>({
			age: weightedAverage.age.confirmation(dataset.age ?? 0),
			gender: weightedAverage.gender.confirmation(dataset.gender),
			maritalStatus: weightedAverage.maritalStatus.confirmation(dataset.maritalStatus),
			educationLevel: weightedAverage.educationLevel.confirmation(dataset.educationLevel),
			incomeRange: weightedAverage.incomeRange.confirmation(dataset.incomeRange),
			residenceType: weightedAverage.residenceType.confirmation(dataset.residenceType),
			disabilityStatus: weightedAverage.disabilityStatus.confirmation(dataset.disabilityStatus),
			householdSize: weightedAverage.householdSize.confirmation(dataset.householdSize ?? 0),
			housingStatus: weightedAverage.housingStatus.confirmation(dataset.housingStatus),
			language: weightedAverage.language.confirmation(dataset.language),
			nationality: weightedAverage.nationality.confirmation(dataset.nationality),
			religion: weightedAverage.religion.confirmation(dataset.religion),
		}, {
			age: 1,
			disabilityStatus: 1,
			educationLevel: 1,
			gender: 1,
			householdSize: 1,
			housingStatus: 1,
			incomeRange: 1,
			language: 1,
			maritalStatus: 1,
			nationality: 1,
			religion: 1,
			residenceType: 1
		}, 0, 1);
	},
	validator: ZodDemographicValidator
})