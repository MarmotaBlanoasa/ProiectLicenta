import Header from "~/components/Header";
import ExpenseForm from "~/components/Expenses/ExpenseForm";
import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getAllCategories} from "~/models/accounting_accounts.server";
import {useLoaderData} from "@remix-run/react";
import {Category} from "@prisma/client";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {expenseSchema, resolverExpense as resolver} from "~/lib/Types";
import {addExpense} from "~/models/expense.server";
import {addMerchant} from "~/models/merchant.server";

export const loader: LoaderFunction = async ({request}) => {
    const userId = getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const categories = await getAllCategories()
    return json({categories})
}


export const action: ActionFunction = async ({request}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof expenseSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const { date, categoryId, merchantName, notes, amount } = data;
    const merchant = await addMerchant({userId, name: merchantName})
    await addExpense({
        userId,
        date: new Date(date),
        categoryId,
        merchantId: merchant.id,
        notes: notes || null,
        amount
    })
    return redirect('/expenses')
}

export default function ExpensesAddExpense(){
    const {categories} = useLoaderData() as {categories: Category[] }
    const defaultValues = {
        date: new Date().toISOString(),
        categoryId: '',
        amount: 0,
        notes: '',
        merchantName: '',

    }
    return (
        <>
            <Header title='Add New Expense' />
            <div className='pt-4'>
                <ExpenseForm categories={categories} defaultValues={defaultValues} />
            </div>
        </>
    )
}