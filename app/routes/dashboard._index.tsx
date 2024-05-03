import Header from "~/components/Header";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {
    getOutstandingInvoicesByUserId,
    getTotalExpensesByCategory,
    getTotalRevenueByMonth,
} from "~/models/dashboard.server";
import {useLoaderData} from "@remix-run/react";
import {Category, Invoice} from "@prisma/client";
import ExpenseChart from "~/components/Dashboard/ExpenseChart";
import {DataTable} from "~/components/DataTable";
import {invoiceColumns} from "~/components/Invoices/InvoiceColumns";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const outstandingInvoices = await getOutstandingInvoicesByUserId({userId});
    const totalOutstanding = outstandingInvoices.totalOutstanding._sum.totalAmount;
    const invoicesData = outstandingInvoices.invoices.map(invoice => {
        return {
            ...invoice,
            client: invoice.client.name
        }
    })
    const totalExpensesByCategory = await getTotalExpensesByCategory({userId});
    const totalRevenue = await getTotalRevenueByMonth({userId});
    return json({totalOutstanding, invoicesData, totalExpensesByCategory, totalRevenue});
}

export default function DashboardIndex() {
    const {totalOutstanding, invoicesData, totalRevenue} = useLoaderData() as unknown as {
        totalOutstanding: number,
        invoicesData: Invoice[] & { client: string }[],
        totalRevenue: { month: string, totalAmount: number }[]
    };

    return (
        <>
            <Header title='Dashboard'
                    description='View key financial metrics at a glance, including cash flow status and outstanding receivables'/>
            <div className='pt-4 flex flex-col gap-4'>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-lg font-semibold'>Outstanding Invoices -
                        Total: ${totalOutstanding}</h2>
                    <DataTable columns={invoiceColumns} data={invoicesData} header='INVOICES'/>
                </div>
            </div>
        </>
    )
}