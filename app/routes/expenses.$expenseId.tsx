import {Link, Outlet, useLoaderData, useLocation, useNavigate} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import Header from "~/components/Header";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getExpenseById} from "~/models/expense.server";
import {Expense} from "@prisma/client";
import {format} from "date-fns";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request)
    if (!userId) {
        return redirect('/login')
    }
    const {expenseId} = params
    if (!expenseId) {
        return redirect('/expenses')
    }
    const expense = await getExpenseById({id: expenseId, userId})
    const expenseDetails = {
        ...expense,
        category: expense?.category.id,
        merchant: expense?.merchant.name
    }
    return json({expenseDetails})

}

export default function ExpensesExpenseId() {
    const {expenseDetails} = useLoaderData() as unknown as {
        expenseDetails: Expense & { category: string } & { merchant: string }
    }
    const location = useLocation();
    const navigate = useNavigate();
    if (location.pathname.includes('edit')) {
        return <Outlet context={{expenseDetails}}/>
    }
    return (
        <>
            <Header title={`Expense ${expenseDetails.id}`}>
                <div className='flex gap-4'>
                    <Link to={`/expenses/${expenseDetails.id}/edit`}>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='edit'/>
                            Edit Expense
                        </Button>
                    </Link>
                    <Button variant='secondary' onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <Link to={`/invoices/${expenseDetails.id}/delete`}>
                        <Button className='flex gap-2 items-center' variant='destructive'>
                            <Svg icon='edit'/>
                            Delete Expense
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <h2 className='text-lg font-semibold italic mb-8'>Expense Details</h2>
                <div className='grid grid-cols-2 gap-4'>
                    <div>
                        <h3 className='text-lg font-semibold'>Description</h3>
                        <p>{expenseDetails.notes}</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold'>Amount</h3>
                        <p>{expenseDetails.amount}</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold'>Date</h3>
                        <p>{format(expenseDetails.date, 'PPP')}</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold'>Category</h3>
                        <p>{expenseDetails.category}</p>
                    </div>
                    <div>
                        <h3 className='text-lg font-semibold'>Merchant</h3>
                        <p>{expenseDetails.merchant}</p>
                    </div>
                </div>
            </div>
        </>
    )
}