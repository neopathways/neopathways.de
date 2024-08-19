export function interpolateHexColors(color1: string, color2: string, factor: number): string {
	if (factor > 1) factor = 1;
	if (factor < 0) factor = 0;

	let r1 = parseInt(color1.slice(1, 3), 16);
	let g1 = parseInt(color1.slice(3, 5), 16);
	let b1 = parseInt(color1.slice(5, 7), 16);

	let r2 = parseInt(color2.slice(1, 3), 16);
	let g2 = parseInt(color2.slice(3, 5), 16);
	let b2 = parseInt(color2.slice(5, 7), 16);

	let r = Math.round(r1 + factor * (r2 - r1)).toString(16);
	let g = Math.round(g1 + factor * (g2 - g1)).toString(16);
	let b = Math.round(b1 + factor * (b2 - b1)).toString(16);

	r = ('0' + r).slice(-2);
	g = ('0' + g).slice(-2);
	b = ('0' + b).slice(-2);

	return `#${r}${g}${b}`;
}