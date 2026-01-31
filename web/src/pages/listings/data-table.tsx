import * as React from "react"
import { useCubeQuery } from "@cubejs-client/react"
import type { SortingState } from "@tanstack/react-table"
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

	const pageFromUrl = Number(searchParams.get("page") ?? 1) || 1
	const pageIndex = Math.max(0, pageFromUrl - 1)
	const pageSize = Number(searchParams.get("pageSize") ?? 10) || 10
	const sortBy = searchParams.get("sortBy") || "co2"
	const sortOrder = searchParams.get("sortOrder") || "desc"

	const sorting: SortingState = React.useMemo(
		() => [{ id: sortBy, desc: sortOrder === "desc" }],
		[sortBy, sortOrder],
	)

	const sortMemberMap: Record<string, string> = {
		country: "emissions.country", // dimension
		co2: "emissions.co2", // measure
		population: "emissions.population_latest", // measure
	}

	const orderMember = sortMemberMap[sortBy] || `emissions.${sortBy}`

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
		order: { [orderMember]: sortOrder } as any,
		limit: pageSize,
		offset: pageIndex * pageSize,
	})

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
		const raw = countResultSet?.tablePivot?.()?.[0]?.["emissions.count"]
		const n = Number(raw)
		return Number.isFinite(n) ? n : 0
	}, [countResultSet])

	const data = React.useMemo(() => {
		if (!resultSet) return []
		return cubeRowsToCountryRows(resultSet.tablePivot())
	}, [resultSet])

	const updateParams = React.useCallback(
		(patch: Record<string, string | null>) => {
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev)
				for (const [k, v] of Object.entries(patch)) {
					if (v === null) next.delete(k)
					else next.set(k, v)
				}
				return next
			})
		},
		[setSearchParams],
	)

	const table = useReactTable({
		data,
		columns,
		manualPagination: true,
		manualSorting: true,
		pageCount: totalRecords ? Math.ceil(totalRecords / pageSize) : -1, // -1 = unknown
		state: {
			sorting,
			pagination: { pageIndex, pageSize },
		},
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: (updater) => {
			const nextSorting =
				typeof updater === "function" ? updater(sorting) : updater
			const sort = nextSorting[0]

			if (!sort) {
				updateParams({ sortBy: null, sortOrder: null, page: "1" })
				return
			}

			updateParams({
				sortBy: sort.id,
				sortOrder: sort.desc ? "desc" : "asc",
				page: "1",
			})
		},
		onPaginationChange: (updater) => {
			const next =
				typeof updater === "function"
					? updater({ pageIndex, pageSize })
					: updater

			updateParams({
				page: String(next.pageIndex + 1),
				pageSize: String(next.pageSize),
			})
		},
	})

	const pageCount = totalRecords
		? Math.ceil(totalRecords / pageSize)
		: undefined
	const canPrev = pageIndex > 0
	const canNext = totalRecords
		? (pageIndex + 1) * pageSize < totalRecords
		: true

	if (error)
		return <div className='p-6 text-red-600'>Error: {String(error)}</div>

	return (
		<div className='w-full h-full flex flex-col min-h-0'>
			{/* Toolbar */}
			<div className='flex items-center gap-3 py-4 shrink-0'>
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

			{/* Table + pinned footer inside one bordered container */}
			<div className='flex-1 min-h-0 overflow-hidden rounded-md border flex flex-col'>
				{/* Header table (non-scrolling) */}
				<div className='shrink-0 border-b bg-background'>
					<Table className='w-full table-fixed'>
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
					</Table>
				</div>

				{/* Body table (scrolling) */}
				<div className='flex-1 min-h-0 overflow-auto'>
					<Table className='w-full table-fixed'>
						<TableBody>
							{isLoading ? (
								Array.from({ length: pageSize }).map((_, i) => (
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
									<TableRow key={row.id}>
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

				{/* Pinned footer (always visible) */}
				<div className='shrink-0 border-t bg-background p-3'>
					<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
						{/* Left: page info */}
						<div className='text-sm text-muted-foreground'>
							Page{" "}
							<span className='font-medium text-foreground'>
								{pageIndex + 1}
							</span>
							{pageCount ? (
								<>
									{" "}
									of{" "}
									<span className='font-medium text-foreground'>
										{pageCount}
									</span>
								</>
							) : (
								<> of …</>
							)}
							{totalRecords ? <> · {totalRecords} rows</> : null}
						</div>

						{/* Right: controls */}
						<div className='flex items-center gap-2'>
							<label className='flex items-center gap-2'>
								<span className='hidden text-sm text-muted-foreground sm:inline'>
									Rows per page
								</span>
								<select
									value={pageSize}
									onChange={(e) => {
										const newSize = Number(e.target.value)
										updateParams({
											pageSize: String(newSize),
											page: "1",
										})
									}}
									className='h-9 w-[140px] rounded-md border border-input bg-background px-3 text-sm'
								>
									{[10, 25, 50].map((size) => (
										<option key={size} value={size}>
											{size} / page
										</option>
									))}
								</select>
							</label>

							<Button
								variant='outline'
								size='sm'
								className='h-9'
								onClick={() =>
									updateParams({
										page: String(Math.max(1, pageIndex)),
									})
								}
								disabled={!canPrev}
							>
								Previous
							</Button>

							<Button
								variant='outline'
								size='sm'
								className='h-9'
								onClick={() =>
									updateParams({
										page: String(pageIndex + 2),
									})
								}
								disabled={!canNext}
							>
								Next
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EmissionsTable
