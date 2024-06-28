import Header from "~/components/Header";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {
    getOutstandingBillsByUserId,
    getOutstandingInvoicesByUserId, getProfitLossByMonth,
    getTotalRevenueByMonth,
} from "~/models/dashboard.server";
import {Link, useLoaderData} from "@remix-run/react";
import {Bill, Invoice} from "@prisma/client";
import {DataTable} from "~/components/DataTable";
import {invoiceColumns} from "~/components/Invoices/InvoiceColumns";
import {Card, CardDescription, CardHeader, CardTitle} from "~/components/ui/ui/card";
import {getCashBankBalance} from "~/models/user.server";
import ProfitLossChart from "~/components/Dashboard/ProfitLossChart";
import {billColumns} from "~/components/Bills/BillColumns";
import {Button} from "~/components/ui/ui/button";
import Svg from "~/components/Svg";

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
    const billsData = outstandingBills.bills.map(bill => {
        return {
            ...bill,
            vendor: bill.vendor.name,
            category: bill?.accountingAccount?.name || ''

        }
    });
    return json({
        totalOutstandingInvoices,
        invoicesData,
        billsData,
        totalOutstandingBills,
        cashBankBalance,
        profitLossByMonth
    });
}

export default function DashboardIndex() {
    const {
        totalOutstandingInvoices,
        invoicesData,
        billsData,
        totalOutstandingBills,
        cashBankBalance,
        profitLossByMonth
    } = useLoaderData() as unknown as {
        totalOutstandingInvoices: number,
        totalOutstandingBills: number,
        cashBankBalance: { cash: { balance: number }, bank: { balance: number } },
        invoicesData: Invoice[] & { client: string }[],
        billsData: Bill[],
        profitLossByMonth: { month: string, profitLoss: number }[]
    };
    return (
        <>
            <Header title='Dashboard'
                    description='Vizualizați rapid principalele metrici financiare, inclusiv situația fluxului de numerar și creanțele restante.'>
                <div className='flex gap-4'>
                    <Link to='/dashboard/profit-loss-report'>
                        <Button className='flex gap-2 items-center'>
                            Raport Profit si Pierdere
                        </Button>
                    </Link>
                </div>
            </Header>
            <div className='pt-4 flex flex-col gap-8'>
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
                    <h2 className='font-medium text-center'>Facturi emise cu termen de plata depasit</h2>
                    <DataTable columns={invoiceColumns} data={invoicesData} header='INVOICES'/>
                </div>
                <div>
                    <h2 className='font-medium text-center'>Facturi primite cu termen de plata depasit</h2>
                    <DataTable columns={billColumns} data={billsData} header='BILLS'/>
                </div>
            </div>
        </>
    )
}