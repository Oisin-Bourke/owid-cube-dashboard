import { Link } from "react-router-dom"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { CountryRow } from "./types"

const formatNumber = (value: number | null) =>
	value == null ? "—" : new Intl.NumberFormat("en-US").format(value)

export const columns: ColumnDef<CountryRow>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label='Select all'
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label='Select row'
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "country",
		header: ({ column }) => (
			<Button
				variant='ghost'
				onClick={() =>
					column.toggleSorting(column.getIsSorted() === "asc")
				}
			>
				Country <ArrowUpDown className='ml-2 h-4 w-4' />
			</Button>
		),
		cell: ({ row }) => {
			const iso = row.original.isoCode
			const name = row.getValue("country") as string

			return (
				<Link to={`/country/${iso}`} className='font-medium underline'>
					{name}
				</Link>
			)
		},
	},
	{
		accessorKey: "isoCode",
		header: "ISO",
		cell: ({ row }) => (
			<div className='text-muted-foreground font-mono'>
				{row.getValue("isoCode")}
			</div>
		),
	},
	{
		accessorKey: "co2",
		header: ({ column }) => (
			<div className='text-right'>
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					CO₂ <ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			</div>
		),
		cell: ({ row }) => (
			<div className='text-right tabular-nums'>
				{formatNumber(row.getValue("co2"))}
			</div>
		),
	},
	{
		accessorKey: "population",
		header: ({ column }) => (
			<div className='text-right'>
				<Button
					variant='ghost'
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Population <ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			</div>
		),
		cell: ({ row }) => (
			<div className='text-right tabular-nums'>
				{formatNumber(row.getValue("population"))}
			</div>
		),
	},
	{
		id: "actions",
		enableHiding: false,
		cell: ({ row }) => {
			const r = row.original
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal className='h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuGroup>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem
								onClick={() =>
									navigator.clipboard.writeText(r.isoCode)
								}
							>
								Copy ISO code
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuGroup>
							<DropdownMenuItem disabled>
								View details (next)
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
