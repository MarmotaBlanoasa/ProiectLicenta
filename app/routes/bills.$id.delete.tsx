import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteBillById} from "~/models/bill.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const {id} = params;
    if (!id) {
        return redirect('/bills')
    }
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    await deleteBillById({id, userId});
    return redirect('/bills')
}