import {LoaderFunction, redirect} from "@remix-run/node";
import {deletePaymentById, getPaymentById} from "~/models/payment.server";
import {getUserId} from "~/session.server";
import {updateAccountingAccount} from "~/models/accounting_accounts.server";
import {getAccountingAccountCodeByPaymentMethod} from "~/utils";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {paymentId} = params
    if (!paymentId) {
        return redirect('/payments')
    }
    const payment = await getPaymentById({id: paymentId, userId})
    if (!payment) {
        return redirect('/payments')
    }
    if (payment.invoiceId) {
        await Promise.all([
            updateAccountingAccount({userId, code: '4111', balance: payment.amount}),
            updateAccountingAccount({
                userId,
                code: getAccountingAccountCodeByPaymentMethod(payment.method),
                balance: payment.amount
            }),
        ])
    }
    if (payment.billId) {
        await Promise.all([
            updateAccountingAccount({userId, code: '401', balance: payment.amount}),
            updateAccountingAccount({
                userId,
                code: getAccountingAccountCodeByPaymentMethod(payment.method),
                balance: payment.amount
            }),
        ])

    }
    deletePaymentById({id: paymentId, userId})
    return redirect('/payments')
}


export default function PaymentsPaymentIdDelete() {
    return null
}