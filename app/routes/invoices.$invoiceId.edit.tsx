import Header from "~/components/Header";
import InvoiceForm from "~/components/Invoices/InvoiceForm";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {editInvoice, getInvoiceById} from "~/models/invoice.server";
import {getAllClientsByUser} from "~/models/client.server";
import {useLoaderData} from "@remix-run/react";
import {Client} from "@prisma/client";
import {addLineItem, deleteLineItemByInvoiceId, getLineItemByInvoiceId} from "~/models/lineItem.server";
import {DefaultValuesInvoice, invoiceSchema, resolverInvoice as resolver} from "~/lib/Types";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";

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
    if (!invoice) {
        return redirect('/invoices')
    }
    const lineItems = await getLineItemByInvoiceId({invoiceId})
    const clients = await getAllClientsByUser({userId})
    const invoiceDetails = {
        invoiceNumber: invoice.invoiceNumber,
        dateIssued: invoice.dateIssued.toISOString(),
        dueDate: invoice.dueDate.toISOString(),
        paidAmount: invoice.paidAmount,
        status: invoice.status as 'paid' | 'unpaid' | 'overdue',
        recurring: invoice.recurring,
        payeePayer: invoice.clientId,
        lineItems: lineItems
    }
    return json({invoiceDetails, clients})
}

export const action: ActionFunction = async ({request, params}) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof invoiceSchema>>(request, resolver)
    if (errors) {
        return json({errors, receivedValues}, {status: 400})
    }
    const {invoiceId} = params
    if (!invoiceId) {
        return redirect('/invoices')
    }
    const userId = await getUserId(request)
    if (!userId) {
        return json({errors: {critical: 'An error occurred while updating your information. Please try again later.'}}, {status: 400})
    }
    const {invoiceNumber, dateIssued, dueDate, payeePayer, recurring, lineItems} = data
    const totalAmount = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    await Promise.all([
        await deleteLineItemByInvoiceId({invoiceId}),
        await editInvoice({
            userId,
            id: invoiceId,
            invoiceNumber,
            dateIssued: new Date(dateIssued),
            dueDate: new Date(dueDate),
            clientId: payeePayer,
            recurring,
            nextBillingDate: null,
            totalAmount
        })
    ])
    await Promise.all(
        lineItems.map(async item => {
            await addLineItem({
                invoiceId,
                description: item.description,
                quantity: item.quantity,
                price: item.price
            })
        })
    )
    return redirect(`/invoices/${invoiceId}`)
}


export default function InvoicesInvoiceIdEdit() {
    const {invoiceDetails, clients} = useLoaderData() as unknown as {
        invoiceDetails: DefaultValuesInvoice,
        clients: Client[]
    }
    return (
        <>
            <Header title='Edit Invoice'/>
            <InvoiceForm defaultValues={invoiceDetails} clients={clients}/>
        </>
    )
}