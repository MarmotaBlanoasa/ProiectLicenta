import {ColumnDef} from "@tanstack/table-core";
import {Client} from "@prisma/client";
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

export const clientColumns: ColumnDef<Client>[] = [
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
        id: "actions",
        cell: ({row}) => {
            const client = row.original
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
                            <DropdownMenuItem><Link to={`/clients/${client.id}`}>View Client</Link></DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/clients/${client.id}/edit`}>Edit Client</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`/clients/${client.id}/delete`}>Delete Client</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        size: 100
    }
]