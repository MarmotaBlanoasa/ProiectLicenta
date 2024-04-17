import {ActionFunction, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getAllCategories} from "~/models/category.server";
import Header from "~/components/Header";
import ExpenseForm from "~/components/Expenses/ExpenseForm";
import {Category, Expense} from "@prisma/client";
import {useLoaderData, useOutletContext} from "@remix-run/react";
import {getValidatedFormData} from "remix-hook-form";
import {expenseSchema, resolverExpense as resolver} from "~/lib/Types";
import * as zod from "zod";
import {addMerchant, getMerchantsByName} from "~/models/merchant.server";
import {editExpenseById} from "~/models/expense.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {expenseId} = params
    if (!expenseId) {
        return redirect('/expenses')
    }
    const categories = await getAllCategories()
    return json({categories})
}

export const action: ActionFunction = async ({request, params}) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof expenseSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {expenseId} = params;
    if (!expenseId) {
        return redirect('/expenses')
    }
    const { date, categoryId, merchantName, notes, amount } = data;
    let merchant = await getMerchantsByName({userId, name: merchantName});
    if (!merchant) {
        merchant = await addMerchant({userId, name: merchantName})
    }
    await editExpenseById({
        id: expenseId,
        userId,
        date: new Date(date),
        categoryId,
        merchantId: merchant.id,
        notes: notes || null,
        amount
    })
    return redirect('/expenses')

}

export default function ExpensesExpenseIdEdit() {
    const {categories} = useLoaderData() as {categories: Category[]};
    const {expenseDetails} = useOutletContext() as {expenseDetails: Expense & { category: string } & { merchant: string }}
    const defaultValues = {
        date: new Date(expenseDetails.date).toISOString(),
        categoryId: expenseDetails.category,
        amount: expenseDetails.amount,
        notes: expenseDetails.notes,
        merchantName: expenseDetails.merchant,
    }
    return (
        <>
            <Header title={`Edit Expense`}/>
            <div>
                <ExpenseForm categories={categories} defaultValues={defaultValues} />
            </div>
        </>
    )

}