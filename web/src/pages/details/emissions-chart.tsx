import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Legend } from "recharts"
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart"

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

const EmisisonsChart = ({ data }: { data: any[] }) => {
	return (
		<ChartContainer config={chartConfig} className='h-80 w-full'>
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
	)
}

export default EmisisonsChart
