import EmissionsTable from "./data-table"

const ListingsPage = () => {
	return (
		<main className='h-full overflow-hidden flex flex-col'>
			<div className='p-6 flex flex-col flex-1 min-h-0'>
				<div className='mb-6 shrink-0'>
					<h1 className='text-2xl font-semibold'>
						OWID CO₂ Dashboard
					</h1>
					<p className='text-muted-foreground'>
						Latest emissions snapshot by country (2024)
					</p>
				</div>

				<div className='flex-1 min-h-0'>
					<EmissionsTable />
				</div>
			</div>
		</main>
	)
}

export default ListingsPage
