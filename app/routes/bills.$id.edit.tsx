import Header from "~/components/Header";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getAllCategories} from "~/models/category.server";
import TransactionForm from "~/components/Bills/BillForm";
import {useLoaderData} from "react-router";
import {Category, Client, Bill} from "@prisma/client";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {BillSchema} from "~/lib/Types";
import {getUserId} from "~/session.server";
import {zodResolver} from "@hookform/resolvers/zod";
import {editBillById, getBillById} from "~/models/bill.server";
import {getAllClientsByUser} from "~/models/client.server";

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
    const billDetails = await getBillById({id, userId});
    const clients = await getAllClientsByUser({userId});
    const categories = await getAllCategories();
    return json({categories, billDetails, clients});
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
    const {date, categoryId, payeePayer, paymentMethod, amount, notes} = data;

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
    await editBillById({
        userId,
        id,
        date: new Date(date),
        categoryId,
        payeePayer,
        paymentMethod,
        amount,
        notes: notes || null
    });
    return redirect(`/bills/${id}`);
}

export default function BillsIdEdit() {
    const {categories, billDetails, clients} = useLoaderData() as {
        categories: Category[],
        billDetails: Bill & { category: Category } & { payeePayer: { id: string, name: string } }
        clients: Client[]
    }
    const defaultValues = {
        date: new Date(billDetails.date).toISOString(),
        categoryId: billDetails.category.id,
        payeePayer: billDetails.payeePayer.id || '',
        paymentMethod: billDetails.paymentMethod || '',
        amount: billDetails.amount,
        notes: billDetails.notes || undefined
    }
    return (
        <>
            <Header title={`Edit Bill - #${billDetails.id}`}
                    description={'Edit the details of this bill.'}/>
            <TransactionForm categories={categories} defaultValues={defaultValues} clients={clients}/>
        </>
    )
}