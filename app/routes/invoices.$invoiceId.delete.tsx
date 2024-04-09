import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteInvoice} from "~/models/invoice.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {invoiceId} = params
    if(!invoiceId){
        return redirect('/invoices')
    }
    await deleteInvoice({id: invoiceId, userId})
    return redirect('/invoices')
}


export default function InvoicesInvoiceIdDelete(){
    return null
}