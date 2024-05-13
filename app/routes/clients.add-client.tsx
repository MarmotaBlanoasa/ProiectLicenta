import Header from "~/components/Header";
import * as zod from "zod";
import { ActionFunctionArgs, json, redirect} from "@remix-run/node";
import {getValidatedFormData, useRemixForm} from "remix-hook-form";
import {getUserId} from "~/session.server";
import {addClient} from "~/models/client.server";
import {ClientSchema, resolverClient as resolver} from "~/lib/Types";
import ClientForm from "~/components/Clients/ClientForm";

export const action = async ({request}: ActionFunctionArgs) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof ClientSchema>>(request, resolver);
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {name, email, phone, address, notes} = data;
    const userId = await getUserId(request);
    if (!userId) {
        return json(
            {
                errors: {
                    critical: 'An error occurred while updating your information. Please try again later.',
                },
            },
            {status: 400},
        );
    }
    await addClient({userId, name, email, phone, address, notes});
    return redirect('/clients');
};
export default function ClientsAddClient() {
    return (
        <>
            <Header title='Add New Client'
                    description="Enter your client's details below to add them to your account. Ensure the information is accurate to facilitate smooth transactions and communications.">
            </Header>
            <ClientForm defaultValues={{name: '', email: '', phone: '', address: '', notes: ''}}/>
        </>
    )
}