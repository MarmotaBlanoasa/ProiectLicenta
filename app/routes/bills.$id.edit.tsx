import Header from "~/components/Header";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getAllCategories} from "~/models/accounting_accounts.server";
import BillForm from "~/components/Bills/BillForm";
import {useLoaderData} from "react-router";
import {AccountingAccount, Bill, Category, Vendor} from "@prisma/client";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {BillSchema} from "~/lib/Types";
import {getUserId} from "~/session.server";
import {zodResolver} from "@hookform/resolvers/zod";
import {editBillById} from "~/models/bill.server";
import {getVendorsByUserId} from "~/models/vendor.server";
import {addLineItem, deleteLineItemByBillId, getLineItemByBillId} from "~/models/lineItem.server";
import {useOutletContext} from "@remix-run/react";

const resolver = zodResolver(BillSchema);

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    const {id} = params;
    if (!id) {
        return redirect('/bills')
    }
    if (!userId) {
        return redirect('/login')
    }
    const vendors = await getVendorsByUserId(userId);
    const categories = await getAllCategories();
    const lineItems = await getLineItemByBillId({billId: id});
    return json({categories, vendors, lineItems});
}
export const action = async ({request, params}: ActionFunctionArgs) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof BillSchema>>(request, resolver);
    const {id} = params;
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {date, dueDate, accountingAccountId, vendor, notes} = data;
    const amount = data.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const userId = await getUserId(request);
    if (!userId) {
        return json(
            {
                errors: {
                    critical: 'An error occurred while updating your information. Please try again later.',
                },
            },
            {status: 400},
        );
    }
    if (!id) {
        return redirect('/bills')
    }
    await Promise.all([
        await deleteLineItemByBillId({billId: id}),
        await editBillById({
            userId,
            id,
            date: new Date(date),
            dueDate: new Date(dueDate),
            accountingAccountId,
            vendor,
            amount,
            notes: notes || null
        })
    ])
    await Promise.all(data.lineItems.map(async (item) => {
        await addLineItem({
            billId: id,
            description: item.description,
            quantity: item.quantity,
            price: item.price
        });
    }))
    return redirect(`/bills/${id}`);
}

export default function BillsIdEdit() {
    const {categories, vendors, lineItems} = useLoaderData() as {
        categories: Category[],
        vendors: Vendor[]
        lineItems: { description: string, quantity: number, price: number }[]
    }
    const {billDetails} = useOutletContext() as {
        billDetails: Bill & { accountingAccount: { id: AccountingAccount['id'], name: AccountingAccount['name'] } } & {
            vendor: { id: Vendor['id'], name: Vendor['name'] }
        }
    }
    const defaultValues = {
        date: new Date(billDetails.date).toISOString(),
        dueDate: new Date(billDetails.dueDate).toISOString(),
        accountingAccountId: billDetails.accountingAccount.id,
        vendor: billDetails.vendor.id || '',
        amount: billDetails.amount,
        notes: billDetails.notes || undefined,
        lineItems: lineItems
    }
    return (
        <>
            <Header title={`Edit Bill - #${billDetails.id}`}
                    description={'Edit the details of this bill.'}/>
            <BillForm categories={categories} defaultValues={defaultValues} vendors={vendors}/>
        </>
    )
}