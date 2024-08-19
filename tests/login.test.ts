import { test, expect, describe } from "bun:test";
import * as fs from "fs"

describe("Login flow", () => {
	let refreshToken: string;
	let accessToken: string;

  test("Retrieve a refresh token", async () => {
		const response = await fetch("http://localhost:4321/api/auth/refreshtoken", {
			headers: {
				Authorization: "Basic " + Buffer.from("user@email.com:password").toString("base64")
			}
		})
		
		expect(response.status).toBe(200);

		refreshToken = (await response.json()).refreshToken;

		expect(typeof refreshToken).toBe("string");
	})

	test("Retrieve an access token", async () => {
		const response = await fetch("http://localhost:4321/api/auth/accesstoken", {
			headers: {
				Authorization: "Bearer " + refreshToken
			}
		})

		expect(response.status).toBe(200);

		accessToken = (await response.json()).accessToken;

		expect(typeof accessToken).toBe("string");
	})

	test("Upload an image", async () => {
		const response = await fetch("http://localhost:4321/api/upload/image", {
			method: "PUT",
			headers: {
				Authorization: "Bearer " + accessToken,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				file: "base64encodedfile",
				name: "image.jpg",
				description: "A beautiful image",
				encoding: "base64",
				mimetype: "image/jpeg",
				image: fs.readFileSync("./public/logo.png").toString("base64")
			})
		})

		expect(response.status).toBe(200);

		const { uid } = await response.json();

		expect(typeof uid).toBe("string");
	})
});