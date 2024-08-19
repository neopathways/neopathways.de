import { getAccuracyPrediction } from "#lib/AccuracyClassification";
import type { DemographicUserRecord } from "#lib/AccuracyClassification/demographic";
import { test, describe } from "bun:test";

describe("Accuracy tests", () => {
	const records: DemographicUserRecord[] = [
		{
			accuracy: 0.5,
			category: "DEMOGRAPHIC",
			data: {
				age: 54,
				disabilityStatus: "no",
				incomeRange: "150k+",
			},
			created: new Date(),
			orguid: "",
			outdated: false,
			tags: [],
			uid: "2",
			updated: new Date(),
			useruid: ""
		},
		{
			accuracy: 0.5,
			category: "DEMOGRAPHIC",
			data: {
				age: 54,
				gender: "male",
				incomeRange: "80k-100k",
				educationLevel: "high_school",
				disabilityStatus: "yes",
				ethnicity: "white",
				householdSize: 4,
				housingStatus: "own",
				language: "english",
				maritalStatus: "single",
				nationality: "american",
				occupation: "student",
				religion: "christian",
				residenceType: "urban"
			},
			created: new Date(),
			orguid: "",
			outdated: false,
			tags: [],
			uid: "1",
			updated: new Date(),
			useruid: ""
		},
	]

	const baseRecord: DemographicUserRecord = {
		accuracy: 0.5,
		category: "DEMOGRAPHIC",
		data: {
			age: 54,
			gender: "female",
			disabilityStatus: "no"
		},
		created: new Date(),
		orguid: "",
		outdated: false,
		tags: [],
		uid: "",
		updated: new Date(),
		useruid: ""
	}

	test("accuracyClassification", async () => {
		const accuracy = getAccuracyPrediction(baseRecord, records)
		console.log(accuracy);
		
	})
})