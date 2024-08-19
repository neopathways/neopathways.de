<script lang="ts">

	import { Bar } from "svelte-chartjs";

	import {
    Chart,
    Title,
    Tooltip,
    BarElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';

  Chart.register(
    Title,
    Tooltip,
    BarElement,
    CategoryScale,
    LinearScale
  );

	import type { ChartData, ScriptableContext } from "chart.js";

	const data: ChartData<"bar"> = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: '% of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: (context) => {
				// Color the last one green
				if (context.dataIndex === 5) {
					return "#45cd5c";
				}
				

				return `oklch(${getComputedStyle(document.documentElement).getPropertyValue('--b3')})`;
			},
      borderWidth: 0,
			borderRadius: 15,
			borderSkipped: false
    },
  ],
};
</script>

<div class="w-full h-full">
	<Bar {data} options={{
		responsive: true,
		maintainAspectRatio: false,
		scales: {
			y: {
				display: false
			},
			x: {
				display: false
			}
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
		}
	}}></Bar>
</div>