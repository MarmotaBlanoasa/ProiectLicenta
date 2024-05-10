import Header from "~/components/Header";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {
    getOutstandingBillsByUserId,
    getOutstandingInvoicesByUserId, getProfitLossByMonth,
    getTotalRevenueByMonth,
} from "~/models/dashboard.server";
import {useLoaderData} from "@remix-run/react";
import {Invoice} from "@prisma/client";
import {DataTable} from "~/components/DataTable";
import {invoiceColumns} from "~/components/Invoices/InvoiceColumns";
import {Card, CardDescription, CardHeader, CardTitle} from "~/components/ui/ui/card";
import {getCashBankBalance} from "~/models/user.server";
import ProfitLossChart from "~/components/Dashboard/ProfitLossChart";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const outstandingInvoices = await getOutstandingInvoicesByUserId({userId});
    const outstandingBills = await getOutstandingBillsByUserId({userId});
    const cashBankBalance = await getCashBankBalance(userId);
    const profitLossByMonth = await getProfitLossByMonth({userId});
    const totalOutstandingBills = outstandingBills.totalOutstanding._sum.amount;
    const totalOutstandingInvoices = outstandingInvoices.totalOutstanding._sum.totalAmount;
    const invoicesData = outstandingInvoices.invoices.map(invoice => {
        return {
            ...invoice,
            client: invoice.client.name
        }
    })
    const totalRevenue = await getTotalRevenueByMonth({userId});
    return json({totalOutstandingInvoices, invoicesData, totalRevenue, totalOutstandingBills, cashBankBalance, profitLossByMonth});
}

export default function DashboardIndex() {
    const {
        totalOutstandingInvoices,
        invoicesData,
        totalRevenue,
        totalOutstandingBills,
        cashBankBalance,
        profitLossByMonth
    } = useLoaderData() as unknown as {
        totalOutstandingInvoices: number,
        totalOutstandingBills: number,
        cashBankBalance: { cash: { balance: number }, bank: { balance: number } },
        invoicesData: Invoice[] & { client: string }[],
        totalRevenue: { month: string, totalAmount: number }[],
        profitLossByMonth: { month: string, profitLoss: number }[]
    };
    console.log(profitLossByMonth)
    return (
        <>
            <Header title='Dashboard'
                    description='View key financial metrics at a glance, including cash flow status and outstanding receivables'/>
            <div className='pt-4 flex flex-col gap-4'>
                <div className='flex justify-center items-center gap-4'>
                    <Card className='min-w-[350px]'>
                        <CardHeader>
                            <CardTitle>
                                {cashBankBalance.cash.balance} RON
                            </CardTitle>
                            <CardDescription>
                                Sold casa
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className='min-w-[350px] gap-4'>
                        <CardHeader>
                            <CardTitle>
                                {cashBankBalance.bank.balance} RON
                            </CardTitle>
                            <CardDescription>
                                Sold in banca
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div className='flex justify-center items-center gap-4'>
                    <Card className='min-w-[350px]'>
                        <CardHeader>
                            <CardTitle>
                                {totalOutstandingInvoices ? totalOutstandingInvoices : 0} RON
                            </CardTitle>
                            <CardDescription>
                                Facturi emise cu termen de plata depasit
                            </CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className='min-w-[350px]'>
                        <CardHeader>
                            <CardTitle>
                                {totalOutstandingBills ? totalOutstandingBills : 0} RON
                            </CardTitle>
                            <CardDescription>
                                Facturi primite cu termen de plata depasit
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
                <div>
                    <ProfitLossChart profitLossData={profitLossByMonth}/>
                </div>
                <div className='flex flex-col gap-4 mt-8'>
                    <DataTable columns={invoiceColumns} data={invoicesData} header='INVOICES'/>
                </div>
            </div>
        </>
    )
}