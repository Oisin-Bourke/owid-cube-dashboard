import { useCubeQuery } from "@cubejs-client/react"

export function useCountryTimeseries(isoCode: string) {
	return useCubeQuery({
		dimensions: [
			"emissions.country",
			"emissions.year",
			"emissions.co2_including_luc",
			"emissions.energy_per_capita",
			"emissions.primary_energy_consumption",
			"emissions.population",
		],
		measures: ["emissions.co2", "emissions.co2_per_capita_avg"],
		filters: [
			{
				member: "emissions.iso_code",
				operator: "equals",
				values: [isoCode],
			},
		],
		order: { "emissions.year": "asc" },
	})
}
