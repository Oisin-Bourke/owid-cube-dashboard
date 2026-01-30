import { useMemo } from "react"
import { useParams, Link } from "react-router-dom"
import EmisisonsChart from "./emissions-chart"
import { useCountryEmissions } from "./hooks"
import { toPoints } from "./utils"

const DetailsPage = () => {
	const { isoCode } = useParams<{ isoCode: string }>()

	const { resultSet, error } = useCountryEmissions(isoCode)

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

			{error ? (
				<p className='text-sm text-red-600'>Error loading data.</p>
			) : (
				<section className='space-y-2'>
					<h2 className='text-lg font-medium'>Emissions over time</h2>
					<EmisisonsChart data={data} />
				</section>
			)}
		</main>
	)
}

export default DetailsPage
