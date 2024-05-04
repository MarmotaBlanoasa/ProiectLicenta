import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteInvoice, getInvoiceById} from "~/models/invoice.server";
import {updateAccountingAccount} from "~/models/accounting_accounts.server";
import {regulateAccountingAccountBalance} from "~/utils";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {invoiceId} = params
    if (!invoiceId) {
        return redirect('/invoices')
    }
    const invoice = await getInvoiceById({id: invoiceId, userId})
    await Promise.all([
        updateAccountingAccount({
            userId,
            code: '4111',
            balance: -(invoice?.totalAmount || 0)
        }),
        updateAccountingAccount({
            userId,
            code: '704',
            balance: -(invoice?.totalAmount || 0)
        }),
        deleteInvoice({id: invoiceId, userId})
    ])

    return redirect('/invoices')
}


export default function InvoicesInvoiceIdDelete() {
    return null
}