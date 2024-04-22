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
    const totalExpensesByCategory = await getTotalExpensesByCategory({userId});
    const totalRevenue = await getTotalRevenueByMonth({userId});
    return json({outstandingInvoices, totalExpensesByCategory, totalRevenue});
}

export default function DashboardIndex() {
    const {outstandingInvoices, totalExpensesByCategory, totalRevenue} = useLoaderData() as unknown as {
        outstandingInvoices: {
            totalOutstanding: {
                _sum: {
                    totalAmount: number
                }
            }, invoices: Invoice[]
        },
        totalExpensesByCategory: { category: Category['name'], totalAmount: number }[],
        totalRevenue: { month: string, totalAmount: number }[]
    };
    console.log(outstandingInvoices.totalOutstanding._sum.totalAmount)

    return (
        <>
            <Header title='Dashboard'
                    description='View key financial metrics at a glance, including cash flow status and outstanding receivables'/>
            <div className='pt-4 flex flex-col gap-4'>
                <div className='flex flex-col gap-4'>
                    <h2 className='text-lg font-semibold'>Outstanding Invoices -
                        Total: ${outstandingInvoices.totalOutstanding._sum.totalAmount}</h2>
                    <DataTable columns={invoiceColumns} data={outstandingInvoices.invoices} header='INVOICES'/>
                </div>
                <ExpenseChart totalExpensesByCategory={totalExpensesByCategory}/>
            </div>
        </>
    )
}