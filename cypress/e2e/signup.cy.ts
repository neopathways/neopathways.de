import { faker } from "@faker-js/faker"

describe('template spec', () => {
  it('Visits the site and will sign up a new user.', () => {
    cy.visit('http://localhost:4321/auth/signup')

		cy.wait(500)

		const gender = faker.person.sexType()
		const firstName = faker.person.firstName(gender)
		const lastName = faker.person.lastName(gender)
		const username = faker.internet.userName({
			firstName,
			lastName
		})
		const email = faker.internet.email({
			firstName,
			lastName
		})
		const password = faker.internet.password({
			length: 12,
			memorable: true
		})

		cy.get("input[name='email']").type(email)
		cy.get("input[name='firstname']").type(firstName)
		cy.get("input[name='lastname']").type(lastName)
		cy.get("input[name='password']").type(password)

		cy.get("button[data-cy='submit']").click();

		cy.url().should("equal", "http://localhost:4321/auth/login")

		cy.wait(500)

		cy.get("input[name='email']").type(email)
		cy.get("input[name='password']").type(password)

		cy.get("button[data-cy='submit']").click()

		cy.url().should("equal", "http://localhost:4321/profile/dashboard")
		cy.getCookie("accessToken").should("exist")
		cy.getCookie("refreshToken").should("exist")
  })
})