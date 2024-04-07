import Header from "~/components/Header";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getAllTransactionsByUser} from "~/models/transaction.server";
import {Transaction} from "@prisma/client";
import {useLoaderData} from "react-router";
import {DataTable} from "~/components/DataTable";
import {transactionColumns} from "~/components/Transactions/TransactionColumns";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const transactions = await getAllTransactionsByUser({userId});
    const transactionsData = transactions.map(transaction => {
        return {
            ...transaction,
            category: transaction.category?.name || 'Uncategorized'
        }
    })
    return json({transactionsData});
}

export default function AllTransactions(){
    const {transactionsData} = useLoaderData() as { transactionsData: Transaction[] };
    console.log(transactionsData)
    return (
        <>
            <Header title='Transactions'
                    description='View and manage all your financial transactions. Add, edit, or categorize your income
                    and expenses to keep your finances organized.'>
                <div className='flex gap-4'>
                    <Link to='/transactions/add-transaction'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Transaction
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <DataTable columns={transactionColumns} data={transactionsData} header='TRANSACTIONS'/>
            </div>
        </>
    )
}