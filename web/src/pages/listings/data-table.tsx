import * as React from "react"
import { useCubeQuery } from "@cubejs-client/react"
import type {
	ColumnFiltersState,
	SortingState,
	VisibilityState,
} from "@tanstack/react-table"
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { columns } from "./columns"

export type CountryRow = {
	country: string
	isoCode: string
	co2: number | null
	population: number | null
}

const LATEST_YEAR = "2024"

function cubeRowsToCountryRows(
	tablePivot: Record<string, any>[],
): CountryRow[] {
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

export function EmissionsTable() {
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
		order: { "emissions.co2": "desc" },
		limit: 250,
	})

	const data = React.useMemo(() => {
		if (!resultSet) return []
		return cubeRowsToCountryRows(resultSet.tablePivot())
	}, [resultSet])

	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: "co2", desc: true },
	])
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: { sorting, columnFilters, columnVisibility, rowSelection },
	})

	if (isLoading) return <div className='p-6'>Loading…</div>
	if (error)
		return <div className='p-6 text-red-600'>Error: {String(error)}</div>

	return (
		<div className='w-full'>
			<div className='flex items-center gap-3 py-4'>
				<Input
					placeholder='Filter countries...'
					value={
						(table
							.getColumn("country")
							?.getFilterValue() as string) ?? ""
					}
					onChange={(event) =>
						table
							.getColumn("country")
							?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' className='ml-auto'>
							Columns <ChevronDown className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuGroup>
							{table
								.getAllColumns()
								.filter((column) => column.getCanHide())
								.map((column) => (
									<DropdownMenuCheckboxItem
										key={column.id}
										className='capitalize'
										checked={column.getIsVisible()}
										onCheckedChange={(value) =>
											column.toggleVisibility(!!value)
										}
									>
										{column.id}
									</DropdownMenuCheckboxItem>
								))}
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div className='overflow-hidden rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={
										row.getIsSelected() && "selected"
									}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='text-muted-foreground flex-1 text-sm'>
					{table.getFilteredSelectedRowModel().rows.length} of{" "}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
