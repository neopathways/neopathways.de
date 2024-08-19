import { defineCollection } from "astro:content";
import { z } from "zod";

const docsCollection = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		date: z.date(),
		tags: z.array(z.string()),
		description: z.string(),
		category: z.string(),
		author: z.string(),
		languages: z.array(z.string()).optional(),
	})
})

export const collections = {
	"docs": docsCollection
}