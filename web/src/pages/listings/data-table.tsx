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
import { useSearchParams } from "react-router-dom"
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
import { Skeleton } from "@/components/ui/skeleton"
import { columns } from "./columns"
import { cubeRowsToCountryRows } from "./utils"

const LATEST_YEAR = "2024"

const EmissionsTable = () => {
	const [searchParams, setSearchParams] = useSearchParams()

	const pageIndex = Number(searchParams.get("page")) || 0
	const pageSize = Number(searchParams.get("pageSize")) || 10
	const sortBy = searchParams.get("sortBy") || "co2"
	const sortOrder = searchParams.get("sortOrder") || "desc"

	const [pageSizeSelect, setPageSizeSelect] = React.useState(pageSize)

	React.useEffect(() => {
		setPageSizeSelect(pageSize)
	}, [pageSize])

	const sortFieldMap: Record<string, string> = {
		co2: "co2",
		population: "population_latest",
	}

	// Fetch paginated data for the table
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
			[`emissions.${sortFieldMap[sortBy] || sortBy}`]: sortOrder,
		} as any,
		limit: pageSize,
		offset: pageIndex * pageSize,
	})

	// Get total record count for pagination
	const { resultSet: countResultSet } = useCubeQuery({
		measures: ["emissions.count"],
		filters: [
			{
				member: "emissions.year",
				operator: "equals",
				values: [LATEST_YEAR],
			},
		],
	})

	const totalRecords = React.useMemo(() => {
		if (!countResultSet) return 250
		const count = countResultSet.tablePivot()[0]?.["emissions.count"]
		return typeof count === "number" ? count : 250
	}, [countResultSet])

	const data = React.useMemo(() => {
		if (!resultSet) return []
		return cubeRowsToCountryRows(resultSet.tablePivot())
	}, [resultSet])

	const [sorting, setSorting] = React.useState<SortingState>([
		{ id: sortBy, desc: sortOrder === "desc" },
	])
	const [columnFilters, setColumnFilters] =
		React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState({})

	const table = useReactTable({
		data,
		columns,
		onSortingChange: (updater) => {
			const newSorting =
				typeof updater === "function" ? updater(sorting) : updater
			setSorting(newSorting)
			const sort = newSorting[0]
			if (sort) {
				setSearchParams((prev) => {
					prev.set("sortBy", sort.id)
					prev.set("sortOrder", sort.desc ? "desc" : "asc")
					prev.set("page", "0") // Reset to first page when sorting changes
					return prev
				})
			}
		},
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		manualPagination: true,
		manualSorting: true,
		pageCount: Math.ceil(totalRecords / pageSize),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: { pageIndex, pageSize },
		},
	})

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
						{isLoading ? (
							Array.from({ length: 10 }).map((_, i) => (
								<TableRow key={i}>
									{columns.map((_, j) => (
										<TableCell key={j}>
											<Skeleton className='h-8 w-full' />
										</TableCell>
									))}
								</TableRow>
							))
						) : table.getRowModel().rows.length ? (
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
				<div className='flex items-center space-x-2'>
					<span className='text-muted-foreground text-sm'>
						Page {pageIndex + 1} of {table.getPageCount()} (
						{totalRecords} total records)
					</span>
					<select
						value={pageSizeSelect}
						onChange={(e) => {
							const newSize = Number(e.target.value)
							setPageSizeSelect(newSize)
							setSearchParams((prev) => {
								prev.set("pageSize", newSize.toString())
								prev.set("page", "0")
								return prev
							})
							table.setPageSize(newSize)
							table.setPageIndex(0)
						}}
						className='h-8 px-3 py-1 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
					>
						{[10, 25, 50].map((size) => (
							<option key={size} value={size}>
								{size} per page
							</option>
						))}
					</select>
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							table.previousPage()
							setSearchParams((prev) => {
								prev.set(
									"page",
									table
										.getState()
										.pagination.pageIndex.toString(),
								)
								return prev
							})
						}}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => {
							table.nextPage()
							setSearchParams((prev) => {
								prev.set(
									"page",
									table
										.getState()
										.pagination.pageIndex.toString(),
								)
								return prev
							})
						}}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}

export default EmissionsTable
