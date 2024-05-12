import {AccountingAccount} from "@prisma/client";

export default function AccountTable({totalProfitOrLoss, accounts}: {
    totalProfitOrLoss: number,
    accounts: { code: string, name: string, balance: number }[]
}) {
    return (
        <div className="max-w-4xl mx-auto p-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-200">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cod</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balanta</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account, index) => (
                    <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.balance.toFixed(2)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                <tr>
                    <td colSpan={2}
                        className="text-right px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Total
                        Profit sau Pierdere:
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{totalProfitOrLoss}</td>
                </tr>
                </tfoot>
            </table>
        </div>
    );
}