<script lang="ts">
	import { IdCard } from "radix-svelte-icons";
	import z from "zod";
	import type { Organization, User, UserRecord } from "@prisma/client";
	import MedicalOdontogram from "#components/Records/MedicalOdontogram.svelte";
	import type { DentalTherapyWithRelations } from "prisma/generated";
	import Transaction from "#components/Records/Transaction.svelte";
	import Material from "#components/Records/Material.svelte";

	export let record: UserRecord & {
		user: User,
		organization: Organization,
		data: DentalTherapyWithRelations;
	};
</script>

<div class="gap-8">
	{#if record.tags.find(tag => tag === "DENTAL")}
		<div class="grid grid-cols-2 gap-8 w-full">
				<div class="border border-base-300 rounded-lg">
					<MedicalOdontogram markedTeeth={record.data.teeth} fill="var(--primary)" stroke="var(--neutral-focus)" fillOpacity={0.4}></MedicalOdontogram>
				</div>
				<div class="flex flex-col gap-4 prose max-w-full">
					<div class="flex flex-col">
						<h3 class="my-0">Dental Treatment</h3>
						<span class="text-base-content text-opacity-50">{record.data.type}</span>
					</div>
					<p class="my-0">{record.data.description}</p>
					{#if record.data.materialsUsed}
						<h4 class="mb-0">Materials Used</h4>
						<div class="grid grid-cols-2 gap-4">
							{#each record.data.materialsUsed as material}
								<Material {material}></Material>
							{/each}
							<Material material={{"$ref": "cm0396c5m0002oka6tvuwztdk", "$type": "Material"}}></Material>
						</div>
					{/if}
					{#if record.data.transactions}
						<h4>Transaction</h4>
						<div class="grid grid-cols-2 gap-4">
							{#each record.data.transactions as transaction}
								<Transaction transaction={transaction} compact={true}></Transaction>
							{/each}
						</div>
					{/if}
				</div>
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-8">
		<div>
			<h2 class="flex flex-row gap-4 items-center"><IdCard size={24}></IdCard> Medical Record</h2>
			<p>Medical records are typically collected through secure healthcare information systems and may include patient data such as diagnoses, treatment plans, medication history, and lab results. This data is often obtained directly from healthcare providers or through patient-reported information in digital health applications.</p>
			<slot name="faq"></slot>
		</div>
		<div>
			<h3>Similar Records</h3>
			<slot name="similar"></slot>
		</div>
	</div>
</div>

<style>
	td {
		@apply px-4 text-base;
	}
</style>
