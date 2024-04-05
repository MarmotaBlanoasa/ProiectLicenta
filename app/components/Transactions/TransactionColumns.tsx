import {ColumnDef} from "@tanstack/table-core";
import {Transaction} from "@prisma/client";
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
import {Form, Link} from "@remix-run/react";

export const transactionColumns: ColumnDef<Transaction>[] = [
    {
        header: ({column}) =>{
            return(
                <Button variant='ghost' onClick={()=> column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Date
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        accessorKey: 'date',
        cell: ({row}) => <div className='px-4'>{format(row.original.date, 'PPP')}</div>,
        size: 200
    },
    {
        header: 'Type',
        accessorKey: 'type'
    },
    {
        header: 'Payee/Payer',
        accessorKey: 'payeePayer'
    },
    {
        header: 'Category',
        accessorKey: 'category'
    },
    {
        header: ({column}) =>{
            return(
                <Button variant='ghost' onClick={()=> column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Amount
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            )
        },
        accessorKey: 'amount',
        cell: ({row}) => <div className='px-4'>{row.original.amount}</div>,
    },
    {
        id: "actions",
        cell: ({row}) => {
            const transaction = row.original
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
                            <DropdownMenuItem><Link to={`/transactions/${transaction.id}`}>View
                                Transaction</Link></DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/transactions/${transaction.id}/edit`}>Edit Transaction</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/transactions/${transaction.id}/delete`}>
                                    Delete Transaction
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