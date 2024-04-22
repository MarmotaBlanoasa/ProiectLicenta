import Header from "~/components/Header";
import {DataTable} from "~/components/DataTable";
import {paymentsColumns} from "~/components/Payments/PaymentsColumns";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getPaymentsByUserId} from "~/models/payment.server";
import {Payment} from "@prisma/client";
import {useLoaderData} from "@remix-run/react";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const payments = await getPaymentsByUserId({userId});
    return json({payments});
}

export default function PaymentsIndex(){
    const {payments} = useLoaderData() as unknown as {payments: Payment[]};
    console.log(payments)
    return (
        <>
            <Header title='Payments' description='Track all payment activities, including both receivables and payables'/>
            <div className='pt-4'>
                <DataTable columns={paymentsColumns} data={payments} header='PAYMENTS' />
            </div>
        </>
    )
}