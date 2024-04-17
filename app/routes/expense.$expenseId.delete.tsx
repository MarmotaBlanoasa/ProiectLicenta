import {LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {deleteExpenseById} from "~/models/expense.server";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {expenseId} = params
    if (!expenseId) {
        return redirect('/expenses')
    }
    await deleteExpenseById({id: expenseId, userId})
    return redirect('/expenses')
}


export default function ExpenseExpenseIdDelete(){
    return null
}