import { useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import MetricLineChartCard from "./metric-line-chart-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCountryTimeseries } from "./hooks"
import { toPoints } from "./utils"

const DetailsPage = () => {
	const { isoCode } = useParams<{ isoCode: string }>()
	const navigate = useNavigate()

	if (!isoCode) return null

	const { resultSet, error, isLoading } = useCountryTimeseries(isoCode)

	const data = useMemo(() => {
		if (!resultSet) return []
		return toPoints(resultSet.tablePivot())
	}, [resultSet])

	const countryName = useMemo(() => {
		if (!resultSet) return isoCode
		const rows = resultSet.tablePivot()
		if (!rows || rows.length === 0) return isoCode
		return rows[0]["emissions.country"] || isoCode
	}, [resultSet, isoCode])

	return (
		<main className='p-6'>
			<div className='mb-6 flex items-center gap-3'>
				<button
					onClick={() => navigate(-1)}
					className='text-sm underline'
				>
					← Back
				</button>
				<h1 className='text-2xl font-semibold'>
					Country detail:{" "}
					{isLoading ? (
						<Skeleton className='inline-block h-6 w-48 mr-2 rounded' />
					) : (
						<span className='mr-2'>{countryName}</span>
					)}
					<span className='font-mono text-sm'>({isoCode})</span>
				</h1>
			</div>

			{error ? (
				<p className='text-sm text-red-600'>Error loading data.</p>
			) : (
				<div>
					<div className='grid gap-6 md:grid-cols-2'>
						<MetricLineChartCard
							data={data}
							title='CO₂ emissions'
							description='Total emissions by year'
							dataKey='co2'
						/>
						<MetricLineChartCard
							data={data}
							title='CO₂ per capita'
							description='Average per person by year'
							dataKey='co2PerCapita'
						/>
					</div>
					<div className='grid gap-6 md:grid-cols-2 mt-6'>
						<MetricLineChartCard
							data={data}
							title='Energy per capita'
							description='Average energy consumption per person by year'
							dataKey='energyPerCapita'
						/>
						<MetricLineChartCard
							data={data}
							title='Population'
							description='Total population by year'
							dataKey='population'
						/>
					</div>
				</div>
			)}
		</main>
	)
}

export default DetailsPage
