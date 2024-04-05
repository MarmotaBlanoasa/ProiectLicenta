import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteTransactionById} from "~/models/transaction.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const {transactionId} = params;
    if (!transactionId) {
        return redirect('/transactions')
    }
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    await deleteTransactionById({id: transactionId, userId});
    return redirect('/transactions')
}