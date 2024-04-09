import {ColumnDef} from "@tanstack/table-core";
import {Invoice} from "@prisma/client";
import {format} from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "~/components/ui/ui/dropdown-menu";
import {Button} from "~/components/ui/ui/button";
import {MoreHorizontal} from "lucide-react";
import {Link} from "@remix-run/react";

export const invoiceColumns: ColumnDef<Invoice>[] =
    [
        {
            header: 'Invoice Number',
            accessorKey: 'invoiceNumber',
        },
        {
            header: 'Client',
            accessorKey: 'client',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({row}) => {
                const status = row.original.status
                return (
                    <div>
                        <span
                            className={`px-2 py-1 rounded-full text-xs ${status === 'paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                            {status.toUpperCase()}
                        </span>
                    </div>
                )
            }
        },
        {
            header: 'Date Issued',
            accessorKey: 'dateIssued',
            cell: ({row}) => {
                return (
                    <div>
                        {format(row.original.dateIssued, 'PPP')}
                    </div>
                )
            }
        },
        {
            header: 'Due Date',
            accessorKey: 'dueDate',
            cell: ({row}) => {
                return (
                    <div>
                        {format(row.original.dueDate, 'PPP')}
                    </div>
                )
            }
        },
        {
            header: 'Paid Amount',
            accessorKey: 'paidAmount',
        },
        {
            header: 'Total Amount',
            accessorKey: 'totalAmount',
        },
        {
            id: 'actions',
            cell: ({row}) => {
                const invoice = row.original
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
                                <DropdownMenuItem><Link to={`/invoices/${invoice.id}`}>View
                                    Invoice</Link></DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to={`/invoices/${invoice.id}/edit`}>Edit Invoice</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link to={`/invoices/${invoice.id}/delete`}>Delete Invoice</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ]