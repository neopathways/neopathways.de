<script lang="ts">
	import SimilarRecords from "#modules/Record/SimilarRecords.svelte";
	import type { ViewUpdate } from "@codemirror/view";
	import type { Organization, User, UserRecord } from "prisma/generated";
	import { api } from "astro-typesafe-api/client";
	import type { EditorView } from "codemirror";
	import Cookies from "js-cookie"
	// import { UserRecordSchema } from "prisma/generated";
	import {
		type ZodTypeAny,
		ZodNumber,
		ZodNullable,
		ZodOptional,
		ZodEnum,
		ZodString,
	} from "zod";
	import FilterInput from "./FilterInput.svelte";
	import { ZodValidatorMap } from "#lib/AccuracyClassification/zod";

	export let record: UserRecord & { user: User, organization: Organization, data: any };

	const zodValidator = ZodValidatorMap[record.category];

	// const categories = Object.values(UserRecordSchema.shape.category.enum);

	let result: Awaited<ReturnType<typeof api.record.GET.fetch>> | null = null;

	function isNumberSchema(schema: ZodTypeAny): boolean {
		return unwrap(schema) instanceof ZodNumber;
	}

	function unwrap(
		schema: ZodTypeAny,
		ignore: any[] = [ZodNullable, ZodOptional]
	): ZodTypeAny {
		if (ignore.includes(schema.constructor)) {
			return unwrap(schema.unwrap());
		}
		return schema;
	}

	async function search() {
		const search = Array.from(
			searchTerm.trim().matchAll(/@(.*?):(.*?)(?: |$)/g)
		);
		tagDropdownOpen = false;

		const filters = search.reduce(
			(acc, [_, key, value]) => {
				if (zodValidator.shape.hasOwnProperty(key)) {
					if (isNumberSchema(zodValidator.shape[key])) {
						const { success, data } = zodValidator.shape[
							key
						].safeParse(parseFloat(value.trim()));

						if (success) {
							acc[key] = data;
						}
					} else {
						acc[key] = value.trim();
					}
				}
				return acc;
			},
			{} as Record<string, any>
		);

		console.log(filters);

		result = await api.record.GET.fetch(
			{
				category: searchCategory,
				orguid: record.organization.uid,
				filters,
				take: 5,
			},
			{
				headers: {
					Authorization: `Bearer ${Cookies.get("accessToken")}`,
				},
			}
		);

		dropdownOpen = true;
	}

	function keydown(e: CustomEvent<KeyboardEvent>) {
		tagDropdownOpen = true;
		dropdownOpen = false;
		if (e.detail.key === "Enter") {
			search();
		} else if (e.detail.key === "Tab") {
			// Attempt autocompletion of the current tag
			const selection = editor.state.selection.main;
			const previousText = editor.state.doc
				.slice(0, selection.from)
				.toString();
			// Go back until we hit an "@" sign or a space
			let from = selection.from;
			while (
				from > 0 &&
				previousText.charAt(from - 1) !== "@" &&
				previousText.charAt(from - 1) !== " "
			) {
				from--;
			}
			// If we hit an "@" sign, we can attempt autocompletion
			// Right now we're only trying to autocomplete the tag name itself
			const partialName = previousText.slice(from, selection.from);

			// Match the partial name against the valid tags
			const matches = validTags.filter((tag) =>
				tag.startsWith(partialName)
			);

			if (matches.length === 1) {
				// If we have a single match, replace the partial name with the full tag
				const to = selection.from;
				editor.dispatch({
					changes: {
						// Keep in mind we remove the "@" sign from the partial name
						from: from - 1,
						to,
						insert: `@${matches[0]}:`,
					},
				});
			}
		}
	}

	const validTags = Object.keys(zodValidator.shape);

	let searchTerm: string = "";
	let searchCategory: UserRecord["category"] = record.category;
	let dropdownOpen: boolean = false;
	let tagDropdownOpen: boolean = false;
	let tagDropdownShowOptions: boolean = false;

	const stringMatcher = new RegExp(
		`(?:${validTags.map((tag) => `@${tag}:`).join("|")})`,
		"g"
	);

	function update(e: CustomEvent<ViewUpdate>) {
		// If the position of the cursor is right after one of the tags, open the dropdown and display possible values.
		const { state } = e.detail;
		const selection = state.selection.main;

		const previousText = state.doc.slice(0, selection.from);

		const matches = previousText.toString().matchAll(stringMatcher);
		const lastMatch = Array.from(matches).pop();

		if (lastMatch) {
			const [match] = lastMatch;
			const tag = match.slice(1, -1);
			const tagIndex = validTags.indexOf(tag);

			if (tagIndex !== -1) {
				tagDropdownOpen = true;
				tagDropdownShowOptions = true;
			}
		} else {
			tagDropdownShowOptions = false;
		}
	}

	let editor: EditorView;

	const isZodNumber = (schema: ZodTypeAny) =>
		unwrap(schema) instanceof ZodNumber;
	const isZodEnum = (schema: ZodTypeAny) => unwrap(schema) instanceof ZodEnum;
	const isZodString = (schema: ZodTypeAny) =>
		unwrap(schema) instanceof ZodString;
	const isZodOptional = (schema: ZodTypeAny) =>
		unwrap(schema, [ZodNullable]) instanceof ZodOptional;
	const isZodNullable = (schema: ZodTypeAny) =>
		unwrap(schema, [ZodOptional]) instanceof ZodNullable;
</script>

<FilterInput
	bind:value={searchTerm}
	bind:editor
	{validTags}
	placeholder="Search..."
	class="w-full"
	on:keydown={keydown}
	on:focusin={() => (tagDropdownOpen = true)}
	on:focusout={() => (tagDropdownOpen = false)}
	on:update={update}
></FilterInput>
<div
	class="dropdown dropdown-left top-16 right-4"
	class:dropdown-open={tagDropdownOpen}
>
	<div
		class="dropdown-content menu bg-base-100 rounded-lg z-[1] w-96 p-4 border border-base-300 flex flex-col gap-4"
	>
		{#each validTags as tag}
			{#if searchTerm.includes(`@${tag}:`)}
				{@const match = searchTerm.match(
					new RegExp(`@${tag}:(.+?)(?:\\s|$)`)
				)}
				{@const zodProperty = zodValidator.shape[tag]}
				<div class="flex flex-row items-center gap-2">
					<span class="text-base-content text-opacity-50"
						>{`${tag}${isZodOptional(zodProperty) || isZodNullable(zodProperty) ? "?" : ""}`}</span
					>
					<span class="text-base-content text-opacity-50">
						{#if match}
							{#if isZodEnum(zodProperty)}
								{@const partialMatch = Object.keys(
									unwrap(zodProperty).Enum
								).filter((key) => key.startsWith(match[1]))}
								{#if partialMatch.length > 0}
									{#each partialMatch as option}
										<span
											class="badge badge-sm badge-neutral"
											>{option}</span
										>
									{/each}
								{:else}
									<span class="badge badge-sm badge-neutral"
										>{match[1]}</span
									>
								{/if}
							{:else}
								<span class="badge badge-sm badge-neutral"
									>{match[1]}</span
								>
							{/if}
						{:else if isZodNumber(zodProperty)}
							<span class="badge badge-sm badge-neutral"
								>number</span
							>
						{:else if isZodString(zodProperty)}
							<span class="badge badge-sm badge-neutral"
								>string</span
							>
						{:else if isZodEnum(zodProperty)}
							{#each Object.keys(unwrap(zodProperty).Enum) as keys}
								<span class="badge badge-sm badge-neutral"
									>{keys}</span
								>
							{/each}
						{/if}
					</span>
				</div>
			{/if}
		{/each}
		<div class="flex flex-row gap-2 flex-wrap">
			{#each validTags as tag}
				{#if !searchTerm.includes(`@${tag}:`)}
					<span class="badge badge-sm badge-primary">{tag}</span>
				{/if}
			{/each}
		</div>
	</div>
</div>
<div
	class="dropdown dropdown-left top-16 right-4"
	class:dropdown-open={dropdownOpen}
>
	<div
		class="dropdown-content menu bg-base-100 rounded-lg z-[1] max-w-[576px] w-max p-4 border border-base-300"
	>
		{#if result && result.records.length > 0}
			<SimilarRecords similar={result.records}></SimilarRecords>
		{:else}
			<div class="flex flex-col items-center justify-center gap-4">
				<span class="text-base-content text-opacity-50"
					>No results found</span
				>
			</div>
		{/if}
	</div>
</div>
