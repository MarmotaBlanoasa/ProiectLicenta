import {json, LoaderFunction, redirect} from "@remix-run/node";
import {getUserId} from "~/session.server";
import {getAllAccountBalances} from "~/models/dashboard.server";
import {useLoaderData} from "@remix-run/react";
import AccountTable from "~/components/Dashboard/AccountTable";

export const loader: LoaderFunction = async ({request}) => {
    const userId = await getUserId(request);
    if (!userId) {
        return redirect('/login')
    }
    const reportData = await getAllAccountBalances(userId);
    return json({reportData})
}


export default function DashboardProfitLossReport() {
    const {reportData} = useLoaderData() as {reportData: {totalProfitOrLoss: number,
            accounts: { code: string, name: string, balance: number }[]}};
    return (
        <div className='flex flex-col items-center'>
            <h1 className="text-2xl font-semibold">Raport Profit si Pierdere</h1>
            <AccountTable totalProfitOrLoss={reportData.totalProfitOrLoss} accounts={reportData.accounts} />
        </div>
    )
}