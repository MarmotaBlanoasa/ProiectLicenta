import Header from "~/components/Header";
import VendorsForm from "~/components/Vendors/VendorsForm";
import {ActionFunction, json, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {resolverVendor as resolver, vendorSchema} from "~/lib/Types";
import {addVendor} from "~/models/vendor.server";

export const action: ActionFunction = async ({request}) => {
    const {
        receivedValues,
        errors,
        data
    } = await getValidatedFormData<zod.infer<typeof vendorSchema>>(request, resolver);
    console.log(receivedValues)
    if (errors) {
        return json({errors, receivedValues}, {status: 400});
    }
    console.log(data)
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const { name, email, phone, address, website } = data;
    await addVendor({
        userId,
        name,
        email,
        phone: phone || null,
        address: address || null,
        website: website || null
    });
    return redirect('/vendors')
}


export default function VendorsAddVendor() {
    const defaultValuesVendor = {
        name: '',
        email: '',
        phone: undefined,
        address: undefined,
        website: undefined
    }
    return (
        <>
            <Header title='Add Vendor'/>
            <div className='pt-4'>
                <VendorsForm defaultValues={defaultValuesVendor}/>
            </div>
        </>
    )
}