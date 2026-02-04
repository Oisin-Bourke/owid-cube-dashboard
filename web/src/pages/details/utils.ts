export type Point = {
	year: number
	co2: number | null
	co2PerCapita: number | null
	energyPerCapita: number | null
	population: number | null
	primaryEnergyConsumption: number | null
	co2IncludingLuc: number | null
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
			energyPerCapita:
				row["emissions.energy_per_capita"] == null
					? null
					: Number(row["emissions.energy_per_capita"]),
			population:
				row["emissions.population"] == null
					? null
					: Number(row["emissions.population"]),
			primaryEnergyConsumption:
				row["emissions.primary_energy_consumption"] == null
					? null
					: Number(row["emissions.primary_energy_consumption"]),
			co2IncludingLuc:
				row["emissions.co2_including_luc"] == null
					? null
					: Number(row["emissions.co2_including_luc"]),
		}))
		.filter((p) => Number.isFinite(p.year))
}
