<script lang="ts">
	import WorldMap from "#components/WorldMap.svelte";
	import { DrawingPinFilled, Person } from "radix-svelte-icons";
	import z from "zod";
	import moment from "moment";
	import SimilarRecords from "./SimilarRecords.svelte";
	import type { Organization, User, UserRecord } from "@prisma/client";
	import type { ZodDemographicValidator } from "#lib/AccuracyClassification/demographic";
	import DemographyChart from "#components/Records/DemographyChart.svelte";

	export let record: UserRecord & {
		user: User,
		organization: Organization,
		data: z.infer<typeof ZodDemographicValidator>;
	};

	export let similar: (UserRecord & {
		data: z.infer<typeof ZodDemographicValidator>;
		user: User,
		organization: Organization
	})[];

	const demographicDistribution: { male: number, female: number, label: string, mark?: "female" | "male" }[] = [
  { "male": 2.5, "female": 2.4, label: "0-4" },
  { "male": 2.7, "female": 2.5, label: "5-9" },
  { "male": 2.8, "female": 2.5, label: "10-14" },
  { "male": 3.0, "female": 2.8, label: "15-19" },
  { "male": 3.1, "female": 3.0, label: "20-24" },
  { "male": 3.1, "female": 3.0, label: "25-29" },
  { "male": 3.0, "female": 2.9, label: "30-34" },
  { "male": 2.9, "female": 2.8, label: "35-39" },
  { "male": 3.1, "female": 3.0, label: "40-44" },
  { "male": 3.3, "female": 3.2, label: "45-49" },
  { "male": 3.2, "female": 3.3, label: "50-54" },
  { "male": 3.0, "female": 3.1, label: "55-59" },
  { "male": 2.7, "female": 2.9, label: "60-64" },
  { "male": 2.4, "female": 2.6, label: "65-69" },
  { "male": 2.1, "female": 2.4, label: "70-74" },
  { "male": 1.7, "female": 2.1, label: "75-79" },
  { "male": 1.3, "female": 1.8, label: "80-84" },
  { "male": 0.9, "female": 1.4, label: "85-89" },
  { "male": 0.4, "female": 0.8, label: "90+" } 
]

if (record.data.age) {
	const ageBracket = Math.floor(record.data.age / 5);
	demographicDistribution[ageBracket].mark = record.data.gender === "female" ? "female" : "male"
}

</script>

<div class="grid grid-cols-[1fr,1fr] gap-8">
	<div class="w-full">
		<DemographyChart demographyDistribution={demographicDistribution} width={500} height={500} class="w-full"></DemographyChart>
		<h2 class="flex flex-row gap-4 items-center"><Person size={24}></Person> Demographic Record</h2>
		<p>Demographic records are useful for population statistics and are usually inferred through publicly available data, CCTV captures or other methods.</p>
		<slot name="faq"></slot>
	</div>

	<div>
		<h3 class="mt-0">Provided Data</h3>
		<table class="table bg-base-200">
			<thead class="bg-base-100">
				<tr class="border-b border-b-base-300">
					<th class="rounded-tl-lg">Property</th>
					<th class="rounded-tr-lg">Value</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>Age</td>
					<td><strong>{record.data?.age}</strong></td>
				</tr>
				<tr>
					<td>Ethnicity</td>
					<td>{record.data.ethnicity}</td>
				</tr>
				<tr>
					<td>Gender</td>
					<td>{record.data.gender}</td>
				</tr>
				<tr>
					<td>Education</td>
					<td>{record.data.educationLevel}</td>
				</tr>
				<tr>
					<td>Income Range</td>
					<td>{record.data.incomeRange}</td>
				</tr>
				<tr>
					<td>Language Spoken</td>
					<td>{record.data.language}</td>
				</tr>
				<tr>
					<td>Nationality</td>
					<td>{record.data.nationality}</td>
				</tr>
				<tr>
					<td>Validation Accuracy</td>
					<td><strong>{Math.round(record.accuracy * 100)}%</strong></td>
				</tr>
				<tr>
					<td>Created</td>
					<td>{moment(record.created).format("MMMM DD, YYYY HH:mm")}</td>
				</tr>
			</tbody>
		</table>
		<h3>Similar Records</h3>
		<slot name="similar"></slot>
	</div>
</div>

<style>
	td {
		@apply px-4 text-base;
	}
</style>
