import type { z } from "zod";

export function createWeightedAccuracyPredictorObject<
	ZodValidator extends z.ZodSchema,
	AccumulatorReturnType extends Partial<Record<keyof z.infer<ZodValidator>, any>>,
	AverageReturnType extends Partial<Record<keyof z.infer<ZodValidator>, any>>,
	BaseSetupType extends Partial<Record<keyof z.infer<ZodValidator>, any>> = z.infer<ZodValidator>,
>(_: {
	validator: ZodValidator;
	base?: () => BaseSetupType | null;
	accumulator: (
		// The previous value of the reducer, or null if it's the first iteration
		previousValue: BaseSetupType,
		currentValue: z.infer<ZodValidator>,
		index: number,
		array: z.infer<ZodValidator>[]
	) => AccumulatorReturnType;
	average: (
		accumulated: AccumulatorReturnType,
		length: number
	) => AverageReturnType;
	predictor: (
		dataset: z.infer<ZodValidator>,
		weightedAverage: AverageReturnType,
		weight?: number
	) => number
}): Required<typeof _> {
	if (!_.base) {
		_.base = () => null;
	}
	return _ as Required<typeof _>;
}