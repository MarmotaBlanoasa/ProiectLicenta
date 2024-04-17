import {ColumnDef} from "@tanstack/react-table";
import {Payment} from "@prisma/client";
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
import {format} from "date-fns";
import {paymentMethodsMap} from "~/utils";
//TODO: SEARCH CONDITIONAL RENDERING
export const paymentsColumns: ColumnDef<Payment>[] = [
    {
        header: 'Payment ID',
        // accessorKey: 'id',
        cell: ({row}) => <div>{row.original.id}</div>
    },
    {
        header: 'Payment Date',
        accessorKey: 'paymentDate',
        cell: ({row}) => <div>{format(row.original.paymentDate, 'PPP')}</div>
    },
    {
        header: 'Payment Method',
        accessorKey: 'method',
        cell: ({row}) => <div>{paymentMethodsMap[row.original.method]}</div>
    },
    {
        header: 'Amount',
        accessorKey: 'amount',
    },
    {
        id: 'actions',
        cell: ({row}) => {
            const payment = row.original
            const invoiceId = payment.invoiceId
            const billId = payment.billId
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
                            {invoiceId && <DropdownMenuItem><Link to={`/invoices/${invoiceId}`}>View
                                Invoice</Link></DropdownMenuItem>}
                            {billId && <DropdownMenuItem><Link to={`/bills/${billId}`}>View Bill</Link></DropdownMenuItem>}
                            <DropdownMenuItem>
                                <Link to={`/payments/${payment.id}/edit`}>Edit Payment</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/payments/${payment.id}/delete`}>Delete Payment</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]