import Header from "~/components/Header";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getClientById, updateClient} from "~/models/client.server";
import {useLoaderData, useParams} from "react-router";
import ClientForm from "~/components/Clients/ClientForm";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {ClientSchema, resolverClient as resolver} from "~/lib/Types";
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

export const action = async ({request, params}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} =
        await getValidatedFormData<zod.infer<typeof ClientSchema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }
    const {clientId} = params;
    if (!clientId) {
        return redirect('/clients')
    }
    const update = await updateClient({userId, id: clientId, ...data });
    if (!update) {
        return json({errors: {critical: 'An error occurred while updating your information. Please try again later.'}}, {status: 400});
    }
    return redirect(`/clients/${clientId}`);
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