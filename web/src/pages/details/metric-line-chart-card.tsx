import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"

type MetricLineChartProps<T extends Record<string, any>> = {
	data: T[]
	title: string
	dataKey: keyof T & string
	description?: string
	heightClassName?: string
	valueFormatter?: (v: number) => string
}

const MetricLineChartCard = <T extends Record<string, any>>({
	data,
	title,
	dataKey,
	description,
	heightClassName = "h-72",
	valueFormatter,
}: MetricLineChartProps<T>) => {
	const COLOR_MAP: Record<string, string> = {
		co2: "var(--chart-1)",
		co2PerCapita: "var(--chart-2)",
		energyPerCapita: "var(--chart-3)",
		population: "var(--chart-4)",
	}

	const color = COLOR_MAP[dataKey] ?? "var(--chart-1)"

	const chartConfig = {
		[dataKey]: {
			label: title,
			color,
		},
	} satisfies ChartConfig

	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description ? (
					<CardDescription>{description}</CardDescription>
				) : null}
			</CardHeader>

			<CardContent>
				<ChartContainer
					config={chartConfig}
					className={`${heightClassName} w-full`}
				>
					<LineChart data={data} margin={{ left: 12, right: 12 }}>
						<CartesianGrid vertical={false} />
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
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							width={80}
							tickFormatter={valueFormatter}
						/>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Line
							type='monotone'
							dataKey={dataKey}
							stroke={color}
							dot={false}
							strokeWidth={2}
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default MetricLineChartCard
