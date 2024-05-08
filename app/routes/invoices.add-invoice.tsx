import Header from "~/components/Header";
import InvoiceForm from "~/components/Invoices/InvoiceForm";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {invoiceSchema, resolverInvoice as resolver} from "~/lib/Types";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {getUserId} from "~/session.server";
import {addInvoice} from "~/models/invoice.server";
import {getAllClientsByUser} from "~/models/client.server";
import {Client} from "@prisma/client";
import {useLoaderData} from "@remix-run/react";
import {addLineItem} from "~/models/lineItem.server";
import {updateAccountingAccount} from "~/models/accounting_accounts.server";

export const action: ActionFunction = async ({request}) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof invoiceSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const userId = await getUserId(request)
    if (!userId) {
        return json({errors: {critical: 'An error occurred while updating your information. Please try again later.'}}, {status: 400})
    }
    const {
        invoiceNumber,
        dateIssued,
        dueDate,
        recurring,
        payeePayer,
        lineItems
    } = data
    const totalTva = lineItems.reduce((acc, item) => acc + ((item.quantity || 0) * (item.price || 0) * (item.tva || 0) / 100), 0)
    const totalAmount = lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0) + ((item.quantity || 0) * (item.price || 0) * ((item.tva || 0) / 100) + 1), 0)
    const invoiceId = await addInvoice({
        userId,
        clientId: payeePayer,
        invoiceNumber,
        recurring,
        totalAmount,
        nextBillingDate: null,
        dateIssued: new Date(dateIssued),
        dueDate: new Date(dueDate)
    })
    lineItems.map(async (item) => {
        await addLineItem({
            invoiceId: invoiceId.id,
            description: item.description,
            quantity: item.quantity || 0,
            price: item.price || 0,
            tva: item.tva || 0
        })
    })
    await Promise.all([
        updateAccountingAccount({userId, code: '4111', balance: totalAmount}),
        updateAccountingAccount({userId, code: '704', balance: totalAmount}),
        updateAccountingAccount({userId, code: '4427', balance: totalTva})
    ])
    return redirect('/invoices')
}

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const clientsData = await getAllClientsByUser({userId});
    return json({clientsData});
}

export default function InvoicesAddInvoice() {
    const generateInvoiceNumber = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    const defaultValues = {
        invoiceNumber: '#' + generateInvoiceNumber(),
        dateIssued: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        nextBillingDate: null,
        payeePayer: '',
        paidAmount: 0,
        totalAmount: 0,
        status: 'unpaid' as 'paid' | 'unpaid' | 'overdue',
        recurring: false,
        lineItems: [{description: '', quantity: 0, price: 0, tva: 19}]
    }
    const {clientsData} = useLoaderData() as { clientsData: Client[] };
    return (
        <>
            <Header title='Add New Invoice'
                    description='Fill out the details below to create a new invoice. You can add items or services, set payment terms, and customize your message to the client. Once completed, review and send your invoice directly or save it as a draft for later.'/>
            <InvoiceForm defaultValues={defaultValues} clients={clientsData}/>
        </>
    )
}