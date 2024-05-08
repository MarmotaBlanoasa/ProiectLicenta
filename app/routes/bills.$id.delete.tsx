import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteBillById, getBillById} from "~/models/bill.server";
import {updateAccountingAccount, updateAccountingAccountById} from "~/models/accounting_accounts.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const {id} = params;
    if (!id) {
        return redirect('/bills')
    }
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const bill = await getBillById({id, userId})
    const totalTva = bill?.lineItems.reduce((acc, item) => acc + ((item.quantity || 0) * (item.price || 0) * (item.tva || 0) / 100), 0) || 0
    await Promise.all([
        updateAccountingAccountById({id: bill?.accountingAccount?.id || '', balance: -(bill?.amount || 0) - totalTva}),
        updateAccountingAccount({userId, code: '401', balance: -(bill?.amount || 0)}),
        updateAccountingAccount({userId, code: '4426', balance: -totalTva}),
        deleteBillById({id, userId})
    ])
    return redirect('/bills')
}