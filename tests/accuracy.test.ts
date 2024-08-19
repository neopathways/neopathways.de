import { getAccuracyPrediction } from "#lib/AccuracyClassification";
import { test, expect, describe } from "bun:test";
import type { UserRecord } from "prisma/generated";

describe("Accuracy tests", () => {
	const records = [
		{
			accuracy: 0.5,
			category: "LOCATION",
			data: {
				latitude: 53.4486828,
				longitude: 10.2235401
			},
			created: new Date(),
			orguid: "",
			outdated: false,
			tags: ["LOCATION"],
			uid: "",
			updated: new Date(),
			useruid: ""
		}
	] as UserRecord[]

	const baseRecord: UserRecord = {
		accuracy: 0.5,
		category: "LOCATION",
		data: {
			latitude: 53.4486828,
			longitude: 10.2235401
		},
		created: new Date(),
		orguid: "",
		outdated: false,
		tags: ["LOCATION"],
		uid: "",
		updated: new Date(),
		useruid: ""
	}

	test("accuracyClassification", async () => {
		const accuracy = getAccuracyPrediction(baseRecord, records)
		console.log(accuracy);
		
	})
})