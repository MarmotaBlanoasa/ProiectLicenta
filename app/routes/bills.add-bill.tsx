import Header from "~/components/Header";
import * as zod from "zod";
import {ActionFunctionArgs, json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";
import {getAllCategories} from "~/models/category.server";
import {useLoaderData} from "react-router";
import {addBill} from "~/models/bill.server";
import {Category, Vendor} from "@prisma/client";
import BillForm from "~/components/Bills/BillForm";
import {zodResolver} from "@hookform/resolvers/zod";
import {BillSchema} from "~/lib/Types";
import {getAllClientsByUser} from "~/models/client.server";
import {addLineItem} from "~/models/lineItem.server";
import {getVendorsByUserId} from "~/models/vendor.server";

const resolver = zodResolver(BillSchema);

export const loader: LoaderFunction = async ({request}) => {
    const categories = await getAllCategories();
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login');
    }
    const vendors = await getVendorsByUserId(userId);
    return json({categories, vendors});
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
    const {date, dueDate, categoryId, vendor, notes, lineItems} = data;
    const amount = lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
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
        categoryId,
        vendorId: vendor,
        amount,
        notes: notes || null,
    });
    await Promise.all(
        lineItems.map(async (item) => {
            await addLineItem({
                billId: bill.id,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
            });
        })
    );
    return redirect('/bills');
}


export default function AddBill() {
    const {categories, vendors} = useLoaderData() as { categories: Category[], vendors: Vendor[]};
    const defaultValues = {
        date: new Date().toISOString(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
        categoryId: '',
        vendor: '',
        notes: '',
        lineItems: [{description: '', quantity: 0, price: 0}]
    }
    return (
        <>
            <Header title='Add New Bill'
                    description='Fill out the form below to record a new bill.'>
            </Header>
            <BillForm categories={categories} defaultValues={defaultValues} vendors={vendors}/>
        </>
    )
}