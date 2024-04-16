import {ColumnDef} from "@tanstack/table-core";
import {Bill} from "@prisma/client";
import {format} from "date-fns";
import {ArrowUpDown, MoreHorizontal} from "lucide-react";
import {Button} from "~/components/ui/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "../ui/ui/dropdown-menu";
import {Link} from "@remix-run/react";

export const billColumns: ColumnDef<Bill>[] = [
    {
        header: ({column}) => {
            return (
                <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown className='ml-2 h-4 w-4'/>
                </Button>
            )
        },
        accessorKey: 'date',
        cell: ({row}) => <div className='px-4'>{format(row.original.date, 'PPP')}</div>,
        size: 200
    },
    {
        header: ({column}) => {
            return (
                <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Due Date
                    <ArrowUpDown className='ml-2 h-4 w-4'/>
                </Button>
            )
        },
        accessorKey: 'dueDate',
        cell: ({row}) => <div className='px-4'>{format(row.original.dueDate, 'PPP')}</div>,
        size: 200
    },
    {
        header: 'Vendor',
        accessorKey: 'vendor'
    },
    {
        header: 'Category',
        accessorKey: 'category'
    },
    {
        header: ({column}) => {
            return (
                <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Amount
                    <ArrowUpDown className='ml-2 h-4 w-4'/>
                </Button>
            )
        },
        accessorKey: 'amount',
        cell: ({row}) => <div className='px-4'>{row.original.amount}</div>,
    },
    {
        header: 'Status',
        accessorKey: 'status',
        cell: ({row}) => {
            const status = row.original.status
            return (
                <div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${status === 'paid' ? 'bg-green-500 text-white' : status === 'unpaid' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}`}
                        >
                            {status.toUpperCase()}
                        </span>
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            const bill = row.original
            return (
                <div className='flex items-center justify-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem><Link to={`/bills/${bill.id}`}>View
                                Bill</Link></DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/bills/${bill.id}/edit`}>Edit Bill</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/bills/${bill.id}/delete`}>
                                    Delete Bill
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )

        },
        size: 100
    }
];