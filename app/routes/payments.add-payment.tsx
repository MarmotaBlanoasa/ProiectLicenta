import {ActionFunction, json, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {paymentSchema, resolverPayment as resolver} from "~/lib/Types";
import {addBillPayment} from "~/models/payment.server";
import {getBillAmountAmountPaidById, updateBillAmountPaidById, updateBillStatusById} from "~/models/bill.server";

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
    if (!billId) {
        return json({error: 'Bill or Invoice ID is required'}, {status: 400})
    }
    await addBillPayment({
        userId,
        paymentDate: new Date(paymentDate),
        amount,
        billId,
        method
    });
    const billPaidAmount = await getBillAmountAmountPaidById({id: billId, userId});
    await updateBillAmountPaidById({id: billId, userId, amountPaid: Number(billPaidAmount?.amountPaid) + amount});
    if (Number(billPaidAmount?.amountPaid) + amount >= Number(billPaidAmount?.amount)) {
        await updateBillStatusById({id: billId, userId, status: 'paid'})
    }
    return null
}

export default function PaymentsAddPayment() {
    return null
}