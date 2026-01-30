import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Legend } from "recharts"

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart"
import { useCountryEmissions } from "./hooks"
import { toPoints } from "./utils"

const chartConfig = {
	co2: {
		label: "CO₂",
		color: "var(--chart-1)",
	},
	co2PerCapita: {
		label: "CO₂ per capita",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig

const DetailsPage = () => {
	const { isoCode } = useParams<{ isoCode: string }>()

	const { resultSet, isLoading, error } = useCountryEmissions(isoCode)

	const data = useMemo(() => {
		if (!resultSet) return []
		return toPoints(resultSet.tablePivot())
	}, [resultSet])

	return (
		<main className='p-6'>
			<div className='mb-6 flex items-center gap-3'>
				<Link to='/' className='text-sm underline'>
					← Back
				</Link>
				<h1 className='text-2xl font-semibold'>
					Country detail: <span className='font-mono'>{isoCode}</span>
				</h1>
			</div>

			{!isLoading && !error && (
				<section className='space-y-2'>
					<h2 className='text-lg font-semibold'>
						CO₂ emissions over time
					</h2>
					<p className='text-muted-foreground text-sm'>
						Source: OWID CO₂ dataset via Cube + DuckDB
					</p>

					<ChartContainer
						config={chartConfig}
						className='h-80 w-full'
					>
						<LineChart data={data} margin={{ left: 12, right: 12 }}>
							<CartesianGrid vertical={false} />
							<Legend />
							<XAxis
								dataKey='year'
								type='number'
								domain={["dataMin", "dataMax"]}
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								allowDecimals={false}
							/>
							<YAxis
								yAxisId='left'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={80}
							/>
							<YAxis
								yAxisId='right'
								orientation='right'
								tickLine={false}
								axisLine={false}
								tickMargin={8}
								width={80}
							/>
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								yAxisId='left'
								type='monotone'
								dataKey='co2'
								stroke='var(--color-co2)'
								dot={false}
								strokeWidth={2}
							/>
							<Line
								yAxisId='right'
								type='monotone'
								dataKey='co2PerCapita'
								stroke='var(--color-co2PerCapita)'
								dot={false}
								strokeWidth={2}
							/>
						</LineChart>
					</ChartContainer>

					{data.length === 0 && (
						<p className='text-sm text-muted-foreground'>
							No data found.
						</p>
					)}
					{error && (
						<p className='text-sm text-red-600'>
							Error loading data.
						</p>
					)}
					{isLoading && (
						<p className='text-sm text-muted-foreground'>
							Loading data...
						</p>
					)}
				</section>
			)}
		</main>
	)
}

export default DetailsPage
