export type CountryRow = {
	country: string
	isoCode: string
	co2: number | null
	population: number | null
}

const cubeRowsToCountryRows = (
	tablePivot: Record<string, any>[],
): CountryRow[] => {
	return tablePivot.map((row) => ({
		country: String(row["emissions.country"] ?? ""),
		isoCode: String(row["emissions.iso_code"] ?? ""),
		co2: row["emissions.co2"] == null ? null : Number(row["emissions.co2"]),
		population:
			row["emissions.population_latest"] == null
				? null
				: Number(row["emissions.population_latest"]),
	}))
}

export { cubeRowsToCountryRows }
