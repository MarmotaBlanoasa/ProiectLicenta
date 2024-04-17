import {ColumnDef} from "@tanstack/table-core";
import {Expense} from "@prisma/client";
import {Button} from "~/components/ui/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "~/components/ui/ui/dropdown-menu";
import {MoreHorizontal} from "lucide-react";
import {Link} from "@remix-run/react";
import {format} from "date-fns";

export const expensesColumns: ColumnDef<Expense>[] = [
    {
        header: 'Description',
        accessorKey: 'notes',
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
    },
    {
        header: 'Date',
        accessorKey: 'date',
        cell: ({row}) => <div>{format(row.original.date, 'PPP')}</div>
    },
    {
        header: 'Category',
        accessorKey: 'categoryId',
    },
    {
        header: 'Merchant',
        accessorKey: 'merchantId',
    },
    {
        id:'actions',
cell: ({row}) => {
            const expense = row.original
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
                            <DropdownMenuItem><Link to={`/expenses/${expense.id}`}>View Expense</Link></DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/expenses/${expense.id}/edit`}>Edit Expense</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/expenses/${expense.id}/delete`}>Delete Expense</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    }
]