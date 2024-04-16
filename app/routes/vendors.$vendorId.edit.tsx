import {ActionFunction, json, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {useOutletContext} from "@remix-run/react";
import {Vendor} from "@prisma/client";
import {getValidatedFormData} from "remix-hook-form";
import * as zod from "zod";
import {resolverVendor as resolver, vendorSchema} from "~/lib/Types";
import {updateVendorById} from "~/models/vendor.server";
import Header from "~/components/Header";
import VendorsForm from "~/components/Vendors/VendorsForm";

export const action: ActionFunction = async ({request, params}) => {
    const {vendorId} = params;
    if (!vendorId) {
        return redirect('/vendors')
    }
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
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
    const {name, email, phone, address, website} = data;
    await updateVendorById({
        id: vendorId,
        userId,
        name,
        email,
        phone: phone || null,
        address: address || null,
        website: website || null
    })
    return redirect(`/vendors/${vendorId}`)
}


export default function VendorsVendorIdEdit() {
    const {vendorDetails} = useOutletContext() as { vendorDetails: Vendor };
    const vendorDefaultValues = {
        name: vendorDetails.name,
        email: vendorDetails.email || '',
        phone: vendorDetails.phone,
        address: vendorDetails.address,
        website: vendorDetails.website

    }
    return (
        <>
            <Header title={`Edit ${vendorDetails.name}`}/>
            <div className='pt-4'>
                <VendorsForm defaultValues={vendorDefaultValues}/>
            </div>
        </>
    )
}