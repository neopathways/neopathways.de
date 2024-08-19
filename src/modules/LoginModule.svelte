<script lang="ts">
	import { api } from "astro-typesafe-api/client"
	import Cookies from "js-cookie"
	import moment from "moment";
	let email = '';
	let password = '';

	async function login(e: MouseEvent) {
		e.preventDefault();

		if (!email || !password) {
			alert('Please fill in all fields');
			return;
		}

		const { refreshToken, expiry: refreshTokenExpiry } = await api.auth.refreshtoken.GET.fetch(undefined, {
			headers: {
				'Content-Type': 'application/json',
				"Authorization": "Basic " + btoa(email + ":" + password)
			}
		})

		const { accessToken, expiry: accessTokenExpiry } = await api.auth.accesstoken.GET.fetch(undefined, {
			headers: {
				'Content-Type': 'application/json',
				"Authorization": "Bearer " + refreshToken
			}
		});

		Cookies.set('accessToken', accessToken, { expires: moment(accessTokenExpiry).toDate() });
		Cookies.set('refreshToken', refreshToken, { expires: moment(refreshTokenExpiry).toDate() });

		const redirectUrl = new URLSearchParams(window.location.search).get('redirecturl');

		if (redirectUrl) {
			window.location.href = redirectUrl;
		} else {
			window.location.href = '/profile/dashboard';
		}
	}
</script>

<div class="border border-base-200 max-w-lg w-full rounded-lg flex flex-col gap-4 p-16 prose prose-base">
	<h1 class="mb-0">Log in</h1>
	<p class="text-gray-500 ">Log in to your Neopathways account to manage your data and connected organizations.</p>
	<label class="form-control w-full">
		<div class="label">	
			<span class="label-text font-semibold">Email</span>
		</div>
		<input type="email" placeholder="Email" name="email" bind:value={email} class="input input-bordered">
	</label>
	<label class="form-control w-full">
		<div class="label">	
			<span class="label-text font-semibold">Password</span>
		</div>
	<input type="password" placeholder="********" name="password" bind:value={password} class="input input-bordered">
	</label>
	<button class="btn btn-primary" data-cy='submit' on:click={login}>Log in</button>
	<div class="flex flex-row justify-between">
		<a href="/auth/signup" class="link text-sm">Don't have an account?</a>
		<a href="/auth/forgot-password" class="link text-sm">Forgot password?</a>
	</div>
</div>