import { createZodRef, ZodRef } from "#lib/refs/types";
import { LocationSchema, TransactionSchema } from "prisma/generated";
import { z } from "zod";

export const ZodCurrency = z.enum(["USD","CAD","EUR","AED","AFN","ALL","AMD","ARS","AUD","AZN","BAM","BDT","BGN","BHD","BIF","BND","BOB","BRL","BWP","BYR","BZD","CDF","CHF","CLP","CNY","COP","CRC","CVE","CZK","DJF","DKK","DOP","DZD","EEK","EGP","ERN","ETB","GBP","GEL","GHS","GNF","GTQ","HKD","HNL","HRK","HUF","IDR","ILS","INR","IQD","IRR","ISK","JMD","JOD","JPY","KES","KHR","KMF","KRW","KWD","KZT","LBP","LKR","LTL","LVL","LYD","MAD","MDL","MGA","MKD","MMK","MOP","MUR","MXN","MYR","MZN","NAD","NGN","NIO","NOK","NPR","NZD","OMR","PAB","PEN","PHP","PKR","PLN","PYG","QAR","RON","RSD","RUB","RWF","SAR","SDG","SEK","SGD","SOS","SYP","THB","TND","TOP","TRY","TTD","TWD","TZS","UAH","UGX","UYU","UZS","VEF","VND","XAF","XOF","YER","ZAR","ZMK"]).describe("The currency code.")
export const ZodPercent = z.number().min(0).max(100)

export const ZodTransactionAmount = z.object({
	amount: z.number().describe("The transaction amount."),
	currency: ZodCurrency,
	tax: ZodPercent.optional().describe("The tax amount in percent."),
	taxIncluded: z.boolean().optional().describe("Whether the tax is included in the transaction."),
})

const ZodNotes = z.string().optional().describe("Additional notes.")

export const ZodHolding = z.union([
	z.object({
		name: z.string().describe("The name of the asset."),
		assetType: z.enum(["Stock", "Bond", "Mutual Fund", "ETF", "REIT", "Commodity", "Currency", "Derivative", "Other"]).describe("The type of asset."),
		quantity: z.number().describe("The held quantity of the asset."),
		purchasePrice: ZodTransactionAmount.describe("The purchase price of the asset."),
		currentPrice: ZodTransactionAmount.describe("The current price of the asset."),
		purchaseDate: z.date().describe("The purchase date of the asset."),
		notes: ZodNotes
	}),
	createZodRef("Holding")
])

export const ZodInvestmentPortfolio = z.object({
	name: z.string().describe("The name of the investment portfolio."),
	holdings: z.array(ZodHolding),
	notes: ZodNotes
})

export const ZodLoan = z.object({
	loanType: z.enum(["Mortgage", "Auto", "Personal", "Student", "Business", "Other"]).describe("The type of loan."),
	principalAmount: ZodTransactionAmount.describe("The principal amount of the loan."),
	outstandingAmount: ZodTransactionAmount.describe("The outstanding amount of the loan."),
	interestRate: z.number().describe("The interest rate of the loan."),
	termInMonths: z.number().describe("The term of the loan."),
	payments: z.array(TransactionSchema).optional().describe("The payments associated with the loan."),
})

export const ZodCreditScore = z.object({
	score: z.number().max(1000).min(0).describe("The credit score."),
	source: z.string().optional().describe("The source of the credit score."),
	date: z.date().optional().describe("The date of the credit score evaluation."),
	notes: ZodNotes
})

export const ZodBudget = z.object({
	name: z.string().describe("The name of the budget."),
	amount: ZodTransactionAmount.describe("The budgeted amount."),
	category: z.string().optional().describe("The category of the budget."),
	tags: z.array(z.string()).optional().describe("The tags associated with the budget."),
	notes: ZodNotes
})

export const ZodFinancialRecord = z.object({
	accountType: z.enum(["Savings", "Checking", "Credit", "Investment", "Loan"]).describe("The type of account."),
	currency: ZodCurrency.describe("The dominant currency of the financial record."),
	balance: z.number().describe("The current balance of the account."),
	transactions: z.array(TransactionSchema).optional().describe("The transactions associated with the account."),
	investmentPortfolio: z.array(ZodInvestmentPortfolio).optional().describe("The investment portfolios associated with the account."),
	loans: z.array(ZodLoan).optional().describe("The loans associated with the account."),
	creditScore: ZodCreditScore.optional().describe("The credit score associated with the account."),
	budgets: z.array(ZodBudget).optional().describe("The budgets associated with the account."),
	notes: ZodNotes
})