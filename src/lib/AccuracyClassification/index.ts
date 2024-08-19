// A function that calculates the accuracy of provided data based on the amount of similar datasets.

import type { UserRecord } from "prisma/generated";
import { locationAccuracyCalculation } from "./location";
import { z } from "zod";
import { demographicAccuracyCalculation } from "./demographic";
import { normalize } from "./math";
import type { createWeightedAccuracyPredictorObject } from "./predictor";





type Dataset = Record<string, any>;

// Data is not manually classified.
function accuracyClassification<
	T extends UserRecord & { data: z.infer<ZodValidator> },
	ZodValidator extends z.ZodSchema,
	AccuracyObject extends ReturnType<typeof createWeightedAccuracyPredictorObject>
>(
	dataset: T,
	previous: T[],
	fn: AccuracyObject
): { uid: string; accuracy: number }[] | never {
	const updatedAccuracies: { uid: string; accuracy: number }[] = [];

	const combined = [...previous, dataset];

	const data = combined.map((record) => {
		const { data, success } = fn.validator.safeParse(record.data);

		if (!success) {
			throw new Error("Invalid data");
		}

		return data;
	});

	if (data.length === 0) {
		return updatedAccuracies;
	}

	const base = fn.base();

	const accumulated = data
		.reduce(fn.accumulator, base) as Dataset;
	const averaged = fn.average(accumulated, data.length);

	data.forEach((dataset, index) => {
		const accuracy = fn.predictor(dataset, averaged);
		updatedAccuracies.push({
			uid: combined[index].uid,
			accuracy,
		});
	});

	return updatedAccuracies;
}

export function getAccuracyPrediction(
	dataset: UserRecord,
	previous: UserRecord[]
): ReturnType<typeof accuracyClassification> | null {
	let result: ReturnType<typeof getAccuracyPrediction> | null = null;
	if (dataset.category === "LOCATION") {
		result = accuracyClassification(
			dataset as UserRecord & {
				data: z.infer<typeof locationAccuracyCalculation.validator>;
			},
			previous as (UserRecord & {
				data: z.infer<typeof locationAccuracyCalculation.validator>;
			})[],
			locationAccuracyCalculation
		);
	} else if (dataset.category === "DEMOGRAPHIC") {
		result = accuracyClassification(
			dataset as UserRecord & {
				data: z.infer<typeof demographicAccuracyCalculation.validator>;
			},
			previous as (UserRecord & {
				data: z.infer<typeof demographicAccuracyCalculation.validator>;
			})[],
			demographicAccuracyCalculation
		);
	}

	return result;
}
