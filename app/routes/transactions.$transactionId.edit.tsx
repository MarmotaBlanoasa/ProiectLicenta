import Header from "~/components/Header";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getAllCategories} from "~/models/category.server";
import TransactionForm from "~/components/Transactions/TransactionForm";
import {useLoaderData} from "react-router";
import {Category, Client, Transaction} from "@prisma/client";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {TransactionSchema} from "~/lib/Types";
import {getUserId} from "~/session.server";
import {zodResolver} from "@hookform/resolvers/zod";
import {editTransactionById, getTransactionById} from "~/models/transaction.server";
import {getAllClientsByUser} from "~/models/client.server";

const resolver = zodResolver(TransactionSchema);

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    const {transactionId} = params;
    if (!transactionId) {
        return redirect('/transactions')
    }
    if (!userId) {
        return redirect('/login')
    }
    const transactionDetails = await getTransactionById({id: transactionId, userId});
    const clients = await getAllClientsByUser({userId});
    const categories = await getAllCategories();
    return json({categories, transactionDetails, clients});
}
export const action = async ({request, params}: ActionFunctionArgs) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof TransactionSchema>>(request, resolver);
    const {transactionId} = params;
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    const {date, type, categoryId, payeePayer, paymentMethod, amount, notes} = data;
    const transactionDate = new Date(date);

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
    if (!transactionId) {
        return redirect('/transactions')
    }
    await editTransactionById({
        userId,
        id: transactionId,
        date: transactionDate,
        type,
        categoryId,
        payeePayer,
        paymentMethod,
        amount,
        notes: notes || null
    });
    return redirect(`/transactions/${transactionId}`);
}

export default function TransactionsTransactionIdEdit() {
    const {categories, transactionDetails, clients} = useLoaderData() as {
        categories: Category[],
        transactionDetails: Transaction & { category: Category } & { payeePayer: { id: string, name: string } }
        clients: Client[]
    }
    const defaultValues = {
        date: new Date(transactionDetails.date).toISOString(),
        type: transactionDetails.type as 'expense' | 'income' | undefined,
        categoryId: transactionDetails.category.id,
        payeePayer: transactionDetails.payeePayer.id || '',
        paymentMethod: transactionDetails.paymentMethod || '',
        amount: transactionDetails.amount,
        notes: transactionDetails.notes || undefined
    }
    return (
        <>
            <Header title={`Edit Transaction - #${transactionDetails.id}`}
                    description={'Edit the details of this transaction.'}/>
            <TransactionForm categories={categories} defaultValues={defaultValues} clients={clients}
                             transactionId={transactionDetails.id}/>
        </>
    )
}