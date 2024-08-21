<script lang="ts">
	import { BarChart, IdCard } from "radix-svelte-icons";
	import z from "zod";
	import type { Organization, User, UserRecord } from "@prisma/client";
	import type { ZodFinancialRecord } from "#lib/types/financial";
	import Transaction from "#components/Records/Transaction.svelte";
	import Holding from "#components/Records/Holding.svelte";
	import IncomeExpenseChart from "#components/Records/IncomeExpenseChart.svelte";
	import { Tab, TabList, TabPanel, Tabs } from "#components/Tabs";
	import CreditScore from "#components/Records/CreditScore.svelte";
	import moment from "moment";

	export let record: UserRecord & {
		user: User,
		organization: Organization,
		data: z.infer<typeof ZodFinancialRecord>;
	};
</script>

<div class="gap-8">
	<Tabs>
		<TabList>
			<Tab>Investments</Tab>
			<Tab>Credit Score</Tab>
		</TabList>
		
		<TabPanel>
			<div class="grid grid-cols-2 gap-8 w-full">
				<div class="border border-base-300 rounded-lg">
					<IncomeExpenseChart margin={12} data={[{income: 400, expense: 300}, {income: 500, expense: 250}, {income: 340, expense: 800}, {income: 670, expense: 200}, {income: 670, expense: 200},{income: 670, expense: 200}]} width={700} height={500} incomeColor="var(--primary)" expenseColor="var(--base-300)" class="w-full"></IncomeExpenseChart>
				</div>
				<div class="flex flex-col gap-4 prose max-w-full">
					<div class="flex flex-col">
						<h3 class="my-0">Financial Record</h3>
						{#if record.data.investmentPortfolio && record.data.investmentPortfolio.length > 0}
							<h4 class="mb-0">Investment Portfolios</h4>
							{#each record.data.investmentPortfolio as portfolio}
								<div class="grid grid-cols-2 gap-4">
									{#each portfolio.holdings as holding}
										<Holding {holding}></Holding>
									{/each}
								</div>
							{/each}
						{/if}
						<!-- {#if record.data.transactions && record.data.transactions.length > 0}
							<h4 class="mb-0">Transactions</h4>
							<div class="flex flex-col gap-4">
								{#each record.data.transactions as transaction}
									<Transaction {transaction} compact={true}></Transaction>
								{/each}
							</div>
						{/if} -->
					</div>
				</div>
			</div>
		</TabPanel>
		<TabPanel>
			<div class="grid grid-cols-2 gap-8 w-full">
				<div class="border border-base-300 rounded-lg">
				</div>
				<div class="flex flex-col gap-4 prose max-w-full">
					<div class="flex flex-col">
						<h3 class="my-0">Credit Score</h3>
						<div class="flex flex-col gap-2 items-center justify-center my-4">
							<span class="text-base text-base-content text-opacity-50">{moment(record.data.creditScore?.date).format("MMMM DD, YYYY")}</span>
							<h4 class="my-0 text-4xl">{record.data.creditScore?.score}</h4>
							<span class="text-xl">{record.data.creditScore?.source}</span>
						</div>
						<p>{record.data.creditScore?.notes}</p>
					</div>
				</div>
			</div>
		</TabPanel>
	</Tabs>
	<div class="grid grid-cols-2 gap-8">
		<div>
			<h2 class="flex flex-row gap-4 items-center"><BarChart size={24}></BarChart> Financial Record</h2>
			<p>Financial records are generally collected through secure financial systems and include data such as transaction histories, account balances, income, expenses, and investment details. This data is often obtained from financial institutions, payment processors, or through user-provided financial information in personal finance applications.</p>
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
