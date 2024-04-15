import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {Link, Outlet, useLoaderData, useLocation} from "@remix-run/react";
import {Bill, Client} from "@prisma/client";
import Header from "~/components/Header";
import {getClientById} from "~/models/client.server";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    const {clientId} = params;
    if (!clientId) {
        return redirect('/clients')
    }
    if (!userId) {
        return redirect('/login')
    }
    const clientDetails = await getClientById({id: clientId, userId});
    //TODO: ADD INVOICES
    return json({clientDetails});
}
export default function ClientsClientId() {
    const location = useLocation();
    const {clientDetails, formatClientTransactions} = useLoaderData() as unknown as {
        clientDetails: Client,
        formatClientTransactions: Bill[]
    }
    if (location.pathname.includes('edit')) {
        return <Outlet/>
    }
    return (
        <>
            <Header title={`${clientDetails.name}`}>
                <div className='flex gap-4'>
                    <Link to={`/clients/${clientDetails.id}/edit`}>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='edit'/>
                            Edit Client
                        </Button>
                    </Link>
                    <Link to='/clients'><Button>Back to Clients</Button></Link>
                    <Link to={`/clients/${clientDetails.id}/delete`}><Button variant='destructive'>Delete
                        Client</Button></Link>
                </div>
            </Header>
            <div className='flex flex-col gap-4 pt-4'>
                <h2 className='text-lg font-medium'>Client Information</h2>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Email Address</p>
                    <p>{clientDetails.email}</p>
                </div>
                <div>
                    <p className='font-medium'>Phone Number</p>
                    <p>{clientDetails.phone}</p>
                </div>
                <div>
                    <p className='font-medium'>Business Address</p>
                    <p>{clientDetails.address}</p>
                </div>
                <div>
                    <p className='font-medium'>Notes</p>
                    <p className=''>{clientDetails.notes}</p>
                </div>
            </div>
            <div className='pt-4'>
                <h2 className='text-lg font-medium'>Invoices</h2>
            </div>
        </>
    )
}