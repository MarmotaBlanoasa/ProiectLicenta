import {LoaderFunction, redirect} from "@remix-run/node";
import {deletePaymentById} from "~/models/payment.server";
import {getUserId} from "~/session.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {paymentId} = params
    if(!paymentId){
        return redirect('/payments')
    }
    await deletePaymentById({id: paymentId, userId})
    return redirect('/payments')
}


export default function PaymentsPaymentIdDelete(){
    return null
}