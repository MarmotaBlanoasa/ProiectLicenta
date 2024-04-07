import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteClient} from "~/models/client.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    const {clientId} = params;
    if (!clientId) {
        return redirect('/clients')
    }
    if (!userId) {
        return redirect('/login')
    }
    await deleteClient({id: clientId, userId});
    return redirect('/clients')
}
export default function ClientsClientIdDelete() {
    return null;
}