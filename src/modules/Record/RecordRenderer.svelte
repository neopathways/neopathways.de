<script lang="ts">
	import LocationRecord from "#modules/Record/LocationRecord.svelte"
	import DemographicRecord from "#modules/Record/DemographicRecord.svelte"
	import MedicalRecord from "#modules/Record/MedicalRecord.svelte"
	import FinancialRecord from "#modules/Record/FinancialRecord.svelte"
	import SimilarRecords from "#modules/Record/SimilarRecords.svelte"
	import type { UserRecord, User, Organization } from "@prisma/client";

	export let record: UserRecord & { user: User, organization: Organization, data: any };
	export let similar: (UserRecord & { user: User, organization: Organization, data: any })[] = [];

	let Element: typeof LocationRecord | typeof DemographicRecord | typeof MedicalRecord | typeof FinancialRecord | null = null;
	
	if (record.category === "LOCATION") {
		Element = LocationRecord;
	} else if (record.category === "DEMOGRAPHIC") {
		Element = DemographicRecord;
	} else if (record.category === "MEDICAL") {
		Element = MedicalRecord;
	} else if (record.category === "FINANCIAL") {
		Element = FinancialRecord;
	}
</script>

<Element {record}>
	<SimilarRecords {similar} slot="similar"></SimilarRecords>
	<div slot="faq">
		<h3>How is the validation accuracy calculated?</h3>
		<p>Validation accuracy is a key attribute of our datasets. It estimates the accuracy of a specific record by considering all previously submitted records and their corresponding accuracy. This estimate also factors in the specificity of the data provided and the historical accuracy of the data provider.</p>
		<p>If you notice any errors in the collected data, you can manually edit or delete specific records.</p>
	</div>
</Element>