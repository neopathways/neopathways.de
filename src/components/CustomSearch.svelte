<script lang="ts">
	import type { ViewUpdate } from "@codemirror/view";
	import type { EditorView } from "codemirror";
	// import { UserRecordSchema } from "prisma/generated";
	import {
		type ZodTypeAny,
		ZodNumber,
		ZodNullable,
		ZodOptional,
		ZodEnum,
		ZodString,
		ZodObject,
	} from "zod";
	import FilterInput from "./FilterInput.svelte";
	import { createEventDispatcher } from "svelte";

	export let schema: ZodObject<any>;

	const dispatch = createEventDispatcher();

	function unwrap(
		schema: ZodTypeAny,
		ignore: any[] = [ZodNullable, ZodOptional]
	): ZodTypeAny {
		if (ignore.includes(schema.constructor)) {
			return unwrap(schema.unwrap());
		}
		return schema;
	}

	function keydown(e: CustomEvent<KeyboardEvent>) {
		autocompleteOpen = true;
		dropdownOpen = false;
		if (e.detail.key === "Enter") {
			dispatch("search", {
				query: query
			});
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
			const match = validTags.find((tag) => tag.startsWith(partialName));

			if (match !== null) {
				// If we have a single match, replace the partial name with the full tag
				const to = selection.from;
				editor.dispatch({
					changes: {
						// Keep in mind we remove the "@" sign from the partial name
						from: from - 1,
						to,
						insert: `@${match}:`,
					},
				});
			}
		}
	}

	const validTags = Object.keys(schema.shape);

	let query: string = "";
	let dropdownOpen: boolean = false;
	let autocompleteOpen: boolean = false;

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
				autocompleteOpen = true;
			}
		}
	}

	let editor: EditorView;

	const isZodNumber = (schema: ZodTypeAny) =>
		unwrap(schema) instanceof ZodNumber;
	const isZodEnum = (schema: ZodTypeAny) => unwrap(schema) instanceof ZodEnum;
	const isZodString = (schema: ZodTypeAny) =>
		unwrap(schema) instanceof ZodString;
	const isZodOptional = (schema: ZodTypeAny) => schema.isOptional();
	const isZodNullable = (schema: ZodTypeAny) => schema.isNullable();
</script>

<div
	class="relative w-full"
>
	<FilterInput
	bind:value={query}
	bind:editor
	{validTags}
	placeholder="Search..."
	class="w-full"
	on:keydown={keydown}
	on:focusin={() => (autocompleteOpen = true)}
	on:blur={() => (autocompleteOpen = false)}
	on:update={update}
	></FilterInput>
	<div
		class="absolute top-[calc(100%+0.5rem)] bg-base-100 rounded-lg z-[1] w-96 p-4 border border-base-300 flex-col gap-4"
		style="left: {editor&& editor.state.selection.main.from}em"
		class:hidden={!autocompleteOpen}
	>
		{#each validTags as tag}
			{#if query.includes(`@${tag}:`)}
				{@const match = query.match(
					new RegExp(`@${tag}:(.*?)(?:\\s|$)`)
				)}
				{@const zodProperty = schema.shape[tag]}
				<div class="flex flex-row items-center gap-2">
					<span class="text-base-content text-opacity-50"
						>{`${tag}${isZodOptional(zodProperty) || isZodNullable(zodProperty) ? "?" : ""}`}</span
					>
					<span class="text-base-content text-opacity-50">
						{#if match && match[1].trim().length > 0}
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
				{#if !query.includes(`@${tag}:`)}
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
		<slot name="results"></slot>
	</div>
</div>
