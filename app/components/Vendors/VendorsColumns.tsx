import {Vendor} from "@prisma/client";
import {ColumnDef} from "@tanstack/react-table";
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

export const vendorsColumns: ColumnDef<Vendor>[] = [
    {
        header: 'Name',
        accessorKey: 'name',
    },
    {
        header: 'Email',
        accessorKey: 'email',
    },
    {
        header: 'Phone',
        accessorKey: 'phone',
    },
    {
        header: 'Address',
        accessorKey: 'address',
    },
    {
        header: 'Website',
        accessorKey: 'website',
        cell: ({row}) => {
            return (
                <>
                    {row.original.website ?
                        <a href={row.original.website} target='_blank' rel='noreferrer'>{row.original.website}</a>:
                        <span className='text-center'>-</span>}

                </>
            )
        }
    },
    {
        id: 'actions',
        cell: ({row}) => {
            return (
                <div className='flex items-center justify-center'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4"/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link to={`/vendors/${row.original.id}`}>View Vendor</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/vendors/${row.original.id}/edit`}>Edit Vendor</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem>
                                <Link to={`/vendors/${row.original.id}/delete`}>Delete</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        }
    }
]