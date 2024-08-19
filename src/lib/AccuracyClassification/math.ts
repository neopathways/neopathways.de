import type { z } from "zod";

export function normalize(value: number, min: number, max: number) {
	return (value - min) / (max - min);
}

export function deviation(value: number, mean: number) {
	return Math.abs(value - mean);
}

export function confirmation(value: number, mean: number, min: number, max: number) {
	return 1 - normalize(deviation(value, mean), min, max);
}

/**
 * Accumulates values and keeps track of the number of valid contributors.
 * If a value is null or undefined, it is simply ignored.
 * Therefore the average is more accurate as invalid values are simply ignored.
 */
export class ContributionAdjustedAccumulator<T extends number> {
	private accumulated: number = 0;
	private contributors: number = 0;
	private _min: number = Infinity;
	private _max: number = -Infinity;

	constructor(value?: T) {
		this.accumulate(value);
		return this;
	}

	accumulate(value: T | null | undefined) {
		if (value === null || value === undefined) {
			return this;
		}

		this.contributors++;
		this.accumulated += value;

		this._min = value < this.min ? value : this.min;
		this._max = value > this.max ? value : this.max;

		return this;
	}

	deviation(value: T) {
		return Math.abs(value - this.average);
	}

	confirmation(value: T) {
		return Math.max(0, 1 - ((this.deviation(value) - this.min) / (this.max - this.min)));
	}

	get average() {
		return this.accumulated / this.contributors;
	}

	get min() {
		return this._min === Infinity ? 0 : this._min;
	}

	get max() {
		return this._max === -Infinity ? 0 : this._max;
	}
}

/**
 * Normalizes the provided data by applying weights to the keys and normalizing the data to a range between min and max.
 * @param data The data to normalize
 * @param weights The weights to apply to the data
 * @param min The minimum value to normalize to
 * @param max The maximum value to normalize to
 */
export function normalizeUsingWeightedKeys<T extends Record<string, number>>(data: T, weights: Record<keyof T, number>, min: number = 0, max: number = 1): number {
	const totalPossibleConfirmation = Object.values(weights).reduce((acc, value) => acc + value, 0);
	

	const numberOfDeviatingKeys = Object.entries(weights).reduce((acc, [key, weight]) => {
		const value = data[key as keyof T];

		if (value === null || value === undefined) {
			return acc + weight
		}

		const normalizedValue = (value * weight);

		return acc - normalizedValue;
	}, totalPossibleConfirmation);

	return normalize(totalPossibleConfirmation - numberOfDeviatingKeys, 0, totalPossibleConfirmation);
}

export class EnumAccumulator<ZodValidator extends z.ZodSchema> {
	private values: Record<string, any> = {};

	constructor(initial?: z.infer<ZodValidator> | null) {		
		if (initial !== null && initial !== undefined) {
			this.values[initial] = 1;
		}
	}

	accumulate(value: z.infer<ZodValidator> | null | undefined) {
		if (value === null || value === undefined) {
			return this;
		}

		this.values[value] = (this.values[value] ?? 0) + 1;
		return this;
	}

	getValues() {
		return this.values;
	}

	/**
	 * Retrieves the percentage of confirmation that the provided value has received overall as a value between 0 and 1.
	 * @param value The key to check for
	 * @returns The percentage of the total that the value of the key is
	 */
	confirmation(value: z.infer<ZodValidator>) {
		const confirmed = this.values[value] ?? 0;

		const total = Object.values(this.values).reduce((acc, value) => acc + value, 0);

		return confirmed / (total || 1);
	}

	getHighest(): { key: z.infer<ZodValidator>; value: number } {
		return Object.entries(this.values).reduce((acc, [key, value]) => {
			if (value > acc.value) {
				return { key, value };
			}

			return acc;
		}, { key: "", value: 0 });
	}

	getLowest(): { key: z.infer<ZodValidator>; value: number } {
		return Object.entries(this.values).reduce((acc, [key, value]) => {
			if (value < acc.value) {
				return { key, value };
			}

			return acc;
		}, { key: "", value: Infinity });
	}
}