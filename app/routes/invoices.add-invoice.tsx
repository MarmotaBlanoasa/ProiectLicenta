import Header from "~/components/Header";
import InvoiceForm from "~/components/Forms/InvoiceForm";
import {ActionFunction, json} from "@remix-run/node";
import {invoiceSchema} from "~/lib/Types";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {resolverInvoice as resolver} from "~/lib/Types";
export const action: ActionFunction = async ({request}) => {
    const {receivedValues, errors, data} = await getValidatedFormData<zod.infer<typeof invoiceSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    console.log(data)
    return null
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
        paidAmount: 0,
        totalAmount: 0,
        status: 'unpaid' as 'paid' | 'unpaid' | 'overdue',
        recurring: false,
        lineItems: [{description: '', quantity: 0, price: 0}]
    }
    return (
        <>
            <Header title='Add New Invoice'
                    description='Fill out the details below to create a new invoice. You can add items or services, set payment terms, and customize your message to the client. Once completed, review and send your invoice directly or save it as a draft for later.'/>
            <InvoiceForm defaultValues={defaultValues}/>
        </>
    )
}