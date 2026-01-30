import { useCubeQuery } from "@cubejs-client/react"

export function useCountryEmissions(isoCode: string | undefined) {
	const { resultSet, isLoading, error } = useCubeQuery(
		{
			dimensions: ["emissions.year"],
			measures: ["emissions.co2", "emissions.co2_per_capita_avg"],
			filters: [
				{
					member: "emissions.iso_code",
					operator: "equals",
					values: [isoCode || ""],
				},
			],
			order: { "emissions.year": "asc" },
			limit: 500,
		},
		{
			skip: !isoCode,
		},
	)

	return { resultSet, isLoading, error }
}
