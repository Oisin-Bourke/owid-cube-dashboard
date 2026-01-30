export type Point = {
	year: number
	co2: number | null
	co2PerCapita: number | null
}

export function toPoints(rows: Record<string, any>[]): Point[] {
	return rows
		.map((row) => ({
			year: Number(row["emissions.year"]),
			co2:
				row["emissions.co2"] == null
					? null
					: Number(row["emissions.co2"]),
			co2PerCapita:
				row["emissions.co2_per_capita_avg"] == null
					? null
					: Number(row["emissions.co2_per_capita_avg"]),
		}))
		.filter((p) => Number.isFinite(p.year))
}
