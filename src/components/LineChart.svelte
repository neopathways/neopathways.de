<script lang="ts">
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler,
	} from "chart.js";

	import { Line } from "svelte-chartjs";

	ChartJS.register(
		Title,
		Tooltip,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler
	);

	import type { ChartData, ScriptableContext } from "chart.js";
	import Padding from "radix-svelte-icons/src/lib/icons/Padding.svelte";

	let width: number, height: number, gradient: CanvasGradient | null;

	const data: ChartData<"line"> = {
		xLabels: [
			"January",
			"February",
			"Marchz",
			"April",
			"May",
			"June",
			"July",
			"awd",
			"awd",
			"awd",
		],
		yLabels: ["0", "25", "50", "75", "100"],
		datasets: [
			{
				label: "",
				fill: false,
				tension: 0,
				backgroundColor: "rgba(0,0,0,1)",
				borderColor: (context: ScriptableContext<"line">) => {
					const green = "#45cd5c";
					const red = "#f44336";

					const chart = context.chart;
					const { ctx, chartArea } = chart;

					if (!chartArea) {
						return;
					}

					const chartWidth = chartArea.right - chartArea.left;
					const chartHeight = chartArea.bottom - chartArea.top;
					if (
						!gradient ||
						width !== chartWidth ||
						height !== chartHeight
					) {
						// Create the gradient because this is either the first render
						// or the size of the chart has changed
						width = chartWidth;
						height = chartHeight;
						gradient = ctx.createLinearGradient(
							0,
							chartArea.bottom,
							0,
							chartArea.top
						);
						gradient.addColorStop(0, red);
						gradient.addColorStop(1, green);
					}

					return gradient;
				},
				borderCapStyle: "round",
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: "bevel",
				pointBorderColor: "rgba(255, 255, 255,0.5)",
				pointBackgroundColor: "rgb(255, 255, 255)",
				pointBorderWidth: 4,
				pointHoverRadius: 4,
				pointHoverBackgroundColor: "rgb(255, 255, 255)",
				pointHoverBorderColor: "rgba(255, 255, 255,0.5)",
				pointHoverBorderWidth: 8,
				pointRadius: 0,
				pointHitRadius: 10,
				data: [100, 100, 100, 100, 100, 90, 20, 100, 100, 100],
				
			},
		],
	};
</script>

<div class="w-full h-full">
	<Line
		{data}
		options={{
			responsive: true,
			maintainAspectRatio: false,
			scales: {
				y: {
					min: 0,
					max: 105,
					ticks: {
						stepSize: 25,
					}
				},
				x: {
					grid: {
						display: false,
					},
				},
			},
			plugins: {
				tooltip: {
					backgroundColor: "#242527",
					borderColor: "#303133",
					borderWidth: 1,
					callbacks: {
						title: function (context) {
							return `${context[0].label} - ${context[0].raw}`;
						},
						label: function (context) {
							return "";
						},
						footer: function (context) {
							return "";
						},
					}
				},
			},
		}}
	></Line>
</div>
