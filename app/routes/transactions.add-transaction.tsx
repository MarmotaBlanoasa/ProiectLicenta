import Header from "~/components/Header";
import * as zod from "zod";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";
import {getAllCategories} from "~/models/category.server";
import {useLoaderData} from "react-router";
import {addTransaction} from "~/models/transaction.server";
import {Category, Client} from "@prisma/client";
import TransactionForm from "~/components/Transactions/TransactionForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {TransactionSchema} from "~/lib/Types";
import {getAllClientsByUser} from "~/models/client.server";

const resolver = zodResolver(TransactionSchema);

export const loader: LoaderFunction = async ({request}) => {
    const categories = await getAllCategories();
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }
    const clients = await getAllClientsByUser({userId});
    return json({categories, clients});
}
export const action = async ({request}: ActionFunctionArgs) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof TransactionSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    console.log(data)
    const {date, type, categoryId, payeePayer, paymentMethod, amount, notes} = data;
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
    const transactionDate = new Date(date);
    await addTransaction({
        userId,
        date: transactionDate,
        type,
        categoryId,
        payeePayer,
        paymentMethod,
        amount,
        notes: notes || null
    });
    return redirect('/transactions');
}


export default function AddTransaction() {
    const {categories, clients} = useLoaderData() as { categories: Category[], clients: Client[] };
    const defaultValues = {
        date: new Date().toISOString(),
        type: undefined,
        categoryId: '',
        payeePayer: '',
        paymentMethod: '',
        amount: 0,
        notes: ''
    }
    return (
        <>
            <Header title='Add New Transaction'
                    description='Fill out the form below to record a new financial transaction.'>
            </Header>
            <TransactionForm categories={categories} defaultValues={defaultValues} clients={clients}/>
        </>
    )
}