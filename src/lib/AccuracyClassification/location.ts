import { z } from "zod";
import { normalize } from "./math";
import { createWeightedAccuracyPredictorObject } from "./predictor";

/**
 * Calculate the distance between two points on the Earth's surface using the Haversine formula.
 *
 * @export
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} The distance between the two points in kilometers.
 */
export function haversine(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const R = 6371; // Radius of the Earth in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

export const ZodLocationValidator = z.object({
	accuracy: z.number().optional().nullable(),
	altitude: z.number().optional().nullable(),
	altitudeAccuracy: z.number().optional().nullable(),
	heading: z.number().optional().nullable(),
	latitude: z.number(),
	longitude: z.number(),
	speed: z.number().optional().nullable()
});

export const locationAccuracyCalculation = createWeightedAccuracyPredictorObject({
	base: () => ({
		latitude: 0,
		longitude: 0,
	}),
	accumulator: (previousValue, currentValue, index, array) => {
		// Make sure the data is not incorrect
		return {
			latitude: currentValue.latitude + previousValue.latitude,
			longitude: currentValue.longitude + previousValue.longitude,
		};
	},
	average: (accumulated, length) => {
		return {
			latitude: accumulated.latitude / length,
			longitude: accumulated.longitude / length,
		};
	},
	predictor: (dataset, weightedAverage, weight = 1) => {
		// Calculate the accuracy based on the deviation from the average and clamp it between 0 and 1
		const distance = haversine(dataset.latitude, dataset.longitude, weightedAverage.latitude, weightedAverage.longitude);
		// The distance can be more than 400km so we also need to clamp it
		const accuracy = 1 - normalize(Math.min(400, distance), 0, 400);

		return accuracy;
	},
	validator: ZodLocationValidator
})