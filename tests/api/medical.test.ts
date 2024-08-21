import { test, describe, expect } from "bun:test";
import { faker } from "@faker-js/faker";
import type { api } from "astro-typesafe-api/client";
import { DentalTherapySchema } from "prisma/generated";
import { generateMock } from "@anatine/zod-mock";

describe("Material", () => {
	let $ref: string;

	test("PUT", async () => {
		// Test the GET route
		const request = await fetch("http://localhost:4321/api/medical", {
			method: "PUT",
			body: JSON.stringify(generateMock(DentalTherapySchema)),
			headers: {
				"Authorization": `Bearer ${process.env.LASTING_ACCESS_TOKEN}`,
				"Content-Type": "application/json"
			}
		})

		expect(request.status).toEqual(200);

		const response: Awaited<ReturnType<typeof api.materials.PUT.fetch>> = await request.json();

		expect(response).toBeDefined();
		expect(response.$ref).toBeDefined();
		expect(typeof response.$ref).toEqual("string");

		$ref = response.$ref;
	});

	test("GET", async () => {
		// Test the PUT route
		const request = await fetch(`http://localhost:4321/api/materials?$ref=${$ref}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json"
			}
		})

		expect(request.status).toEqual(200);

		const response: Awaited<ReturnType<typeof api.materials.GET.fetch>> = await request.json();

		expect(response).toBeDefined();
		expect(response.uid).toBeDefined();
		expect(typeof response.uid).toEqual("string");
	})
})