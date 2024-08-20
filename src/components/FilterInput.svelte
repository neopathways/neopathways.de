<script lang="ts">
	import { Decoration } from "@codemirror/view";
	import { RangeSetBuilder } from "@codemirror/state";
	import { type Extension } from "@codemirror/state";
	import {
		ViewPlugin,
		type DecorationSet,
		ViewUpdate,
	} from "@codemirror/view";
	import { onMount } from "svelte";
	import { EditorView } from "codemirror";
	import { placeholder as placeholderExtension } from "@codemirror/view";
	import { createEventDispatcher } from "svelte";

	export let value: string;
	export let validTags: string[] = [];
	export let editor: EditorView | null = null;
	export let placeholder: string = "";

	const baseTheme = EditorView.baseTheme({
		".cm-filter": {
			borderRadius: "0.25rem",
			padding: "0.25rem",
			marginRight: "0.25rem",
			marginLeft: "0.25rem",
		},
	});

	function filterHighlight(
		options: { step?: number } = {}
	): Extension {
		return [baseTheme, showMarks];
	}

	const mark = Decoration.mark({
		attributes: { class: "cm-filter" },
	});

	function filterMarker(view: EditorView) {
		let builder = new RangeSetBuilder<Decoration>();
		for (let { from, to } of view.visibleRanges) {
			for (let pos = from; pos <= to; ) {
				let line = view.state.doc.lineAt(pos);
				// Get the text and find all filters
				const regex = new RegExp(
					`(?:${validTags.map((tag) => `(?:@${tag}:)`).join("|")})`,
					"g"
				);
				const text = line.text;
				const matches = text.matchAll(regex);

				for (const match of matches) {
					builder.add(
						line.from + match.index,
						line.from + match.index + match[0].length,
						mark
					);
				}

				pos = line.to + 1;
			}
		}
		return builder.finish();
	}

	const showMarks = ViewPlugin.fromClass(
		class {
			decorations: DecorationSet;

			constructor(view: EditorView) {
				this.decorations = filterMarker(view);
			}

			update(update: ViewUpdate) {
				dispatch("update", update);
				if (update.docChanged || update.viewportChanged)
					this.decorations = filterMarker(update.view);
			}
		},
		{
			decorations: (v) => v.decorations,
		}
	);

	onMount(() => {
		editor = new EditorView({
			doc: value,
			extensions: [
				// placeholderExtension(placeholder),
				filterHighlight(),
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						value = update.state.doc.toString();
						dispatch("input", value);
					}
				}),
				ViewPlugin.fromClass(class {}, {
					eventHandlers: {
						keydown: (event) => {
							if (event.key === "Tab") {
								event.preventDefault();
							}
							dispatch("keydown", event);
						},
						focusin: (event) => {
							dispatch("focusin", event);
						},
						focusout: (event) => {
							dispatch("focusout", event);
						},
					},
				}),
			],
			parent: element,
		});
	});

	let element: HTMLDivElement;


	const dispatch = createEventDispatcher();

	const { class: className, ...rest } = $$restProps;
</script>

<div
	bind:this={element}
	class="input input-bordered flex items-center text-base-content {className}"
	{...rest}
></div>

<style>
	:global(.cm-editor) {
		width: 100%;
		overflow-x: auto;
	}

	:global(.cm-focused) {
		outline: none !important;
	}

	:global(.cm-line) {
		padding: 0 !important;
	}

	:global(.cm-filter) {
		@apply bg-base-300;
	}
</style>
