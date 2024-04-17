import Header from "~/components/Header";
import {DataTable} from "~/components/DataTable";
import {expensesColumns} from "~/components/Expenses/ExpensesColumns";
import {Link, useLoaderData} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getExpensesByUserId} from "~/models/expense.server";
import {Category, Expense, Merchant} from "@prisma/client";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const expenses = await getExpensesByUserId({userId});
    const expensesData = expenses.map(expense => {
        return {
            ...expense,
            categoryId: expense.category.name,
            merchantId: expense.merchant.name
        }
    })
    return json({expensesData});
}


export default function ExpensesIndex(){
    const {expensesData} = useLoaderData() as unknown as {expensesData: Expense[]};
    return (
        <>
            <Header title='Expenses'>
                <div className='flex gap-4'>
                    <Link to='/expenses/add-expense'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Expense
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <DataTable columns={expensesColumns} data={expensesData} header='EXPENSES' />
            </div>
        </>
    )
}