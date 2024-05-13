import Header from "~/components/Header";
import {Link, Outlet, useLocation, useNavigate} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {useLoaderData} from "react-router";
import {getBillById} from "~/models/bill.server";
import {getUserId} from "~/session.server";
import {Bill} from "@prisma/client";
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
    const navigate = useNavigate();
    const {billDetails} = useLoaderData() as {
        billDetails: Bill & { accountingAccount: { id: string, name: string } } & { vendor: { id: string, name: string } }
    };
    const url = useLocation();
    if (url.pathname.includes('edit')) {
        return <Outlet context={{billDetails}}/>
    }
    return (
        <>
            <Header title={<p className='flex items-center gap-4'>Bill <span
                className={`px-2 py-1 rounded-full text-xs ${billDetails.status === 'paid' ? 'bg-green-500 text-white' : billDetails.status === 'unpaid' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'}`}>{billDetails.status.toUpperCase()}</span>
            </p>}>
                <div className='flex gap-4'>
                    <Link to='/bills/add-bill'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New Bill
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='flex flex-col gap-4 pt-4'>
                <h2 className='text-lg font-medium'>Bill Information</h2>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Amount</p>
                    <p>${billDetails.amount}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Date</p>
                    <p>{format(billDetails.date, 'PPP')}</p>
                </div>
                <div>
                    <p className='font-medium'>Due Date</p>
                    <p>{format(billDetails.dueDate, 'PPP')}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Category</p>
                    <p>{billDetails.accountingAccount.name}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Vendor</p>
                    <p>{billDetails.vendor.name}</p>
                </div>
                <div className='flex flex-col gap-2'>
                    <p className='font-medium'>Notes</p>
                    <p>{billDetails.notes}</p>
                </div>
                <div className='flex gap-4'>
                    <Link to={`/bills/${billDetails.id}/edit`}>
                        <Button>Edit Bill</Button>
                    </Link>
                    <Button variant='outline' onClick={()=>navigate(-1)}>Go Back</Button>
                </div>
            </div>
        </>
    )
}