import Header from "~/components/Header";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getAllBillsByUser} from "~/models/bill.server";
import {Bill} from "@prisma/client";
import {useLoaderData} from "react-router";
import {DataTable} from "~/components/DataTable";
import {billColumns} from "~/components/Bills/BillColumns";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const bills = await getAllBillsByUser({userId});
    const billsData = bills.map(bill => {
        return {
            ...bill,
            payeePayer: bill.payeePayer?.name || 'No Vendor',
            category: bill.category?.name || 'Uncategorized'
        }
    })
    return json({billsData});
}

export default function AllBills() {
    const {billsData} = useLoaderData() as { billsData: Bill[] };
    console.log(billsData)
    return (
        <>
            <Header title='Bills'
                    description='View and manage all your financial bills. Add, edit, or categorize your income
                    and expenses to keep your finances organized.'>
                <div className='flex gap-4'>
                    <Link to='/bills/add-bill'>
                        <Button className='flex gap-2 items-center'>
                            <Svg icon='plus'/>
                            Add New bill
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4'>
                <DataTable columns={billColumns} data={billsData} header='BILLS'/>
            </div>
        </>
    )
}