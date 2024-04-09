import Header from "~/components/Header";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getClientById} from "~/models/client.server";
import {useLoaderData, useParams} from "react-router";
import ClientForm from "~/components/Clients/ClientForm";
type ClientDetails = {
    name: string
    email: string
    phone: string
    address: string
    notes: string

}
export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }
    const {clientId} = params;
    if (!clientId) {
        return redirect('/clients')
    }
    const client = await getClientById({id: clientId, userId});
    const clientDetails = {
        name: client?.name || '',
        email: client?.email || '',
        phone: client?.phone || '',
        address: client?.address || '',
        notes: client?.notes || '',
    }
    return json({clientDetails, clientId});
}

export default function ClientsClientIdEdit(){
    const {clientDetails} = useLoaderData() as { clientDetails: ClientDetails }
    const {clientId} = useParams();
    return (
        <>
            <Header title={`Edit - ${clientDetails.name}`}/>
            <ClientForm defaultValues={clientDetails} clientId={clientId}/>
        </>
    )
}