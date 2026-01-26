import { useCubeQuery } from "@cubejs-client/react"

const LATEST_YEAR = "2024"

const App = () => {
	const { resultSet, isLoading, error } = useCubeQuery({
		dimensions: ["emissions.country", "emissions.iso_code"],
		measures: ["emissions.co2", "emissions.population_latest"],
		filters: [
			{
				member: "emissions.year",
				operator: "equals",
				values: [LATEST_YEAR],
			},
		],
		order: {
			"emissions.co2": "desc",
		},
		limit: 20,
	})

	console.log("Cube Query ResultSet:", resultSet)

	if (isLoading) return <p>Loading…</p>
	if (error) return <p>Error: {error.toString()}</p>
	if (!resultSet) return null

	const rows = resultSet.tablePivot()
	console.log("Rows data after table pivot:", rows)

	return (
		<div>
			<main style={{ padding: 24 }}>
				<h1>OWID CO₂ Dashboard</h1>
			</main>
			{/* TEMP CODE - TO BE REMOVED */}
			<div style={{ padding: 24 }}>
				<h1>CO₂ emissions by country ({LATEST_YEAR})</h1>

				<table>
					<thead>
						<tr>
							<th>Country</th>
							<th>CO₂</th>
							<th>Population</th>
						</tr>
					</thead>
					<tbody>
						{rows.map((row) => (
							<tr key={row["emissions.iso_code"]}>
								<td>{row["emissions.country"]}</td>
								<td>
									{Number(
										row["emissions.co2"],
									).toLocaleString()}
								</td>
								<td>
									{Number(
										row["emissions.population_latest"],
									).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default App
