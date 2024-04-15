import Header from "~/components/Header";
import {Link, Outlet, useLocation} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "react-router";
import {getBillById} from "~/models/bill.server";
import {getUserId} from "~/session.server";
import {Client, Bill} from "@prisma/client";
import {format} from "date-fns";

export const loader: LoaderFunction = async ({request, params}) => {
    const userId = await getUserId(request);
    const {id} = params;
    if (!id) {
        return redirect('/bills')
    }
    if (!userId) {
        return redirect('/login')
    }
    const billDetails = await getBillById({id, userId});
    return json({billDetails});
}

export default function BillsBillId() {
    const {billDetails} = useLoaderData() as {
        billDetails: Bill & { category: { name: string, type: string } } & { payeePayer: { id: string, name: string } }
    };
    console.log(billDetails)
    const url = useLocation();
    if (url.pathname.includes('edit')) {
        return <Outlet/>
    }
    return (
        <>
            <Header title={`Transactions - #${billDetails.id}`}>
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
                    <p>${billDetails.amount}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Date</p>
                    <p>{format(billDetails.date, 'PPP')}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Category</p>
                    <p>{billDetails.category.name}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Payment Method</p>
                    <p>{billDetails.paymentMethod}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Payee/Payer</p>
                    <p>{billDetails.payeePayer.name}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Notes</p>
                    <p>{billDetails.notes}</p>
                </div>
                <div className='flex gap-4'>
                    <Link to={`/transactions/${billDetails.id}/edit`}>
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