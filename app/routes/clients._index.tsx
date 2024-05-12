import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import Header from "~/components/Header";
import {DataTable} from "~/components/DataTable";
import {clientColumns} from "~/components/Clients/ClientColumns";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "react-router";
import { Client } from "@prisma/client";
import {getUserId} from "~/session.server";
import {getAllClientsByUser} from "~/models/client.server";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const clientsData = await getAllClientsByUser({userId});
    return json({clientsData});
}
export default function AllClients(){
    const {clientsData} = useLoaderData() as { clientsData: Client[] };
    return (
        <>
            <Header title='Clients' description='Keep your client details organized. View client information, add new clients, or update existing
                    client profiles effortlessly'>
                <div className='flex gap-4'>
                    <Link to='/clients/add-client'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Adauga client nou
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <DataTable columns={clientColumns} data={clientsData} header='CLIENTS' />
            </div>
        </>
    )
}