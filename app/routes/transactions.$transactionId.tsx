import Header from "~/components/Header";
import {Link, Outlet, useLocation} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "react-router";
import {getTransactionById} from "~/models/transaction.server";
import {getUserId} from "~/session.server";
import {Client, Transaction} from "@prisma/client";
import {format} from "date-fns";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    const {transactionId} = params;
    if (!transactionId) {
        return redirect('/transactions')
    }
    if (!userId) {
        return redirect('/login')
    }
    const transactionDetails = await getTransactionById({id: transactionId, userId});
    return json({transactionDetails});
}

export default function TransactionsTransactionId() {
    const {transactionDetails} = useLoaderData() as {
        transactionDetails: Transaction & { category: { name: string, type: string } } & {payeePayer: {id: string, name:string}}
    };
    console.log(transactionDetails)
    const url = useLocation();
    if (url.pathname.includes('edit')) {
        return <Outlet/>
    }
    return (
        <>
            <Header title={`Transactions - #${transactionDetails.id}`}>
                <div className='flex gap-4'>
                    <Link to='/transactions/add-transaction'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Transaction
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='flex flex-col gap-4 pt-4'>
                <h2 className='text-lg font-medium'>Transaction Information</h2>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Amount</p>
                    <p>${transactionDetails.amount}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Date</p>
                    <p>{format(transactionDetails.date, 'PPP')}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Type</p>
                    <p>{transactionDetails.type}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Category</p>
                    <p>{transactionDetails.category.name}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Payment Method</p>
                    <p>{transactionDetails.paymentMethod}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Payee/Payer</p>
                    <p>{transactionDetails.payeePayer.name}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Notes</p>
                    <p>{transactionDetails.notes}</p>
                </div>
                <div className='flex gap-4'>
                    <Link to={`/transactions/${transactionDetails.id}/edit`}>
                        <Button>Edit Transaction</Button>
                    </Link>
                    <Link to='/transactions'>
                        <Button variant='outline'>Go Back</Button>
                    </Link>
                </div>
            </div>
        </>
    )
}