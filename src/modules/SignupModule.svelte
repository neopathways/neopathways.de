<script lang="ts">
	import { api } from "astro-typesafe-api/client"
	import { z } from "astro:content";
	let email = '';
	let firstName = '';
	let lastName = '';
	let password = '';

	async function signUp(e: MouseEvent) {
		e.preventDefault();

		if (!email || !password || !firstName || !lastName) {
			alert('Please fill in all fields');
			return;
		}

		if (!z.string().email().safeParse(email).success) {
			alert("Please enter a valid email address")
			return;
		}

		const { uid } = await api.auth.user.PUT.fetch({
			email,
			firstname: firstName,
			lastname: lastName,
			password
		})

		if (!uid) {
			alert("Creating your new account didn't work.")
		}

		window.location.href = "/auth/login";
	}
</script>

<div class="border border-base-200 max-w-lg w-full rounded-lg flex flex-col gap-4 p-16 prose prose-base">
	<h1 class="mb-0">Sign Up</h1>
	<p class="text-gray-500 ">Create an account with Neopathways to manage your personal information, create organizations and manage identity relations.</p>
	<label class="form-control w-full">
		<div class="label">	
			<span class="label-text font-semibold">Email</span>
		</div>
		<input type="email" placeholder="Email" bind:value={email} name="email" class="input input-bordered">
	</label>
	<div class="grid grid-cols-2 gap-4">
		<label class="form-control w-full">
			<div class="label">	
				<span class="label-text font-semibold">First Name</span>
			</div>
			<input type="text" placeholder="Max" bind:value={firstName} name="firstname" class="input input-bordered">
		</label>
		<label class="form-control w-full">
			<div class="label">	
				<span class="label-text font-semibold">Last Name</span>
			</div>
			<input type="text" placeholder="Meyers" bind:value={lastName} name="lastname" class="input input-bordered">
		</label>
	</div>
	<label class="form-control w-full">
		<div class="label">	
			<span class="label-text font-semibold">Password</span>
		</div>
	<input type="password" placeholder="********" bind:value={password} name="password" class="input input-bordered">
	</label>
	<button class="btn btn-primary" data-cy="submit" on:click={signUp}>Sign up</button>
	<div class="flex flex-row justify-between">
		<a href="/auth/login" class="link text-sm">Already have an account?</a>
	</div>
</div>