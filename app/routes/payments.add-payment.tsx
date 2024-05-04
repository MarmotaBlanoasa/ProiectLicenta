import {ActionFunction, json, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {paymentSchema, resolverPayment as resolver} from "~/lib/Types";
import {addBillPayment, addInvoicePayment} from "~/models/payment.server";
import {getBillAmountAmountPaidById, updateBillAmountPaidById, updateBillStatusById} from "~/models/bill.server";
import {
    getInvoiceAmountAmountPaidById,
    updateInvoiceAmountPaidById,
    updateInvoiceStatusById
} from "~/models/invoice.server";
import {updateAccountingAccount} from "~/models/accounting_accounts.server";
import {getAccountingAccountCodeByPaymentMethod} from "~/utils";

export const action: ActionFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof paymentSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    console.log(data)
    const {paymentDate, amount, billId, invoiceId, method} = data;
    if (billId) {
        await addBillPayment({
            userId,
            paymentDate: new Date(paymentDate),
            amount,
            billId,
            method
        });
        const billPaidAmount = await getBillAmountAmountPaidById({id: billId, userId});
        await updateBillAmountPaidById({id: billId, userId, amountPaid: Number(billPaidAmount?.amountPaid) + amount});
        await updateAccountingAccount({userId, code: '401', balance: -amount});
        await updateAccountingAccount({userId, code: getAccountingAccountCodeByPaymentMethod(method), balance: -amount});
        if (Number(billPaidAmount?.amountPaid) + amount >= Number(billPaidAmount?.amount)) {
            await updateBillStatusById({id: billId, userId, status: 'paid'})
        } else {
            await updateBillStatusById({id: billId, userId, status: 'partial'})
        }
    }

    if (invoiceId) {
        await addInvoicePayment({userId, paymentDate: new Date(paymentDate), amount, invoiceId, method});
        const invoicePaidAmount = await getInvoiceAmountAmountPaidById({id: invoiceId, userId});
        await updateInvoiceAmountPaidById({
            id: invoiceId,
            userId,
            paidAmount: Number(invoicePaidAmount?.paidAmount) + amount
        });
        await updateAccountingAccount({userId, code: '4111', balance: -amount});
        await updateAccountingAccount({userId, code: getAccountingAccountCodeByPaymentMethod(method), balance: amount});
        if (Number(invoicePaidAmount?.paidAmount) + amount >= Number(invoicePaidAmount?.totalAmount)) {
            await updateInvoiceStatusById({id: invoiceId, userId, status: 'paid'})
        } else {
            await updateInvoiceStatusById({id: invoiceId, userId, status: 'partial'})
        }
    }
    return null
}

export default function PaymentsAddPayment() {
    return null
}