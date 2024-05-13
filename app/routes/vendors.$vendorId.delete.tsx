import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteVendorById} from "~/models/vendor.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {vendorId} = params
    if(!vendorId){
        return redirect('/vendors')
    }
    await deleteVendorById({id: vendorId, userId})
    return redirect('/vendors')
}

export default function VendorVendorIdDelete() {
    return null
}