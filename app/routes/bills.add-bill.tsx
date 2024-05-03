import Header from "~/components/Header";
import * as zod from "zod";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";
import {
    getAllCategories,
    getAllExpenseAccounts, updateAccountingAccount,
    updateAccountingAccountById
} from "~/models/accounting_accounts.server";
import {useLoaderData} from "react-router";
import {addBill} from "~/models/bill.server";
import {AccountingAccount, Category, Vendor} from "@prisma/client";
import BillForm from "~/components/Bills/BillForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {BillSchema} from "~/lib/Types";
import {getAllClientsByUser} from "~/models/client.server";
import {addLineItem} from "~/models/lineItem.server";
import {getVendorsByUserId} from "~/models/vendor.server";

const resolver = zodResolver(BillSchema);

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }
    const accounts = await getAllExpenseAccounts({userId});
    const vendors = await getVendorsByUserId(userId);
    return json({accounts, vendors});
}
export const action = async ({request}: ActionFunctionArgs) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof BillSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    console.log(data)
    const {date, dueDate, accountingAccountId, vendor, notes, lineItems} = data;
    const amount = lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
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
    const bill = await addBill({
        userId,
        date: new Date(date),
        dueDate: new Date(dueDate),
        accountingAccountId,
        vendorId: vendor,
        amount,
        notes: notes || null,
    });
    await Promise.all(
        lineItems.map(async (item) => {
            await addLineItem({
                billId: bill.id,
                description: item.description,
                quantity: item.quantity || 0,
                price: item.price || 0,
            });
        })
    );
    await updateAccountingAccountById({id: accountingAccountId, balance: amount});
    await updateAccountingAccount({userId, code:'401', balance: amount})
    return redirect('/bills');
}


export default function AddBill() {
    const {accounts, vendors} = useLoaderData() as { accounts: AccountingAccount[], vendors: Vendor[]};
    const defaultValues = {
        date: new Date().toISOString(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        accountingAccountId: '',
        vendor: '',
        notes: '',
        lineItems: [{description: '', quantity: null, price: null}]
    }
    console.log(accounts)
    return (
        <>
            <Header title='Add New Bill'
                    description='Fill out the form below to record a new bill.'>
            </Header>
            <BillForm accounts={accounts} defaultValues={defaultValues} vendors={vendors}/>
        </>
    )
}