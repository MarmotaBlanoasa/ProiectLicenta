// import { Line, Bar } from 'react-chartjs-2';
// import { useMemo } from 'react';
//
// type Transaction = {
//     revenue:{
//         amount: number;
//         latestDate: Date;
//     };
//     expenses:{
//         amount: number;
//         latestExpenseDate: Date;
//         latestBillDate: Date;
//     };
// }
//
// export default function ProfitLossChart({ transactions } : { transactions: Transaction[] }){
//     const { data: chartData, labels } = useMemo(() => {
//         const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
//         const labels = sortedTransactions.map(transaction => new Date(transaction.date).toLocaleDateString());
//         const revenueData = sortedTransactions.map(transaction => transaction.type === 'revenue' ? transaction.amount : 0);
//         const expensesData = sortedTransactions.map(transaction => transaction.type === 'expense' ? transaction.amount : 0);
//         const profitData = sortedTransactions.map(transaction => transaction.type === 'revenue' ? transaction.amount : -transaction.amount);
//
//         return {
//             labels,
//             data: {
//                 labels,
//                 datasets: [
//                     {
//                         label: 'Revenue',
//                         data: revenueData,
//                         borderColor: 'rgb(75, 192, 192)',
//                         backgroundColor: 'rgba(75, 192, 192, 0.5)',
//                     },
//                     {
//                         label: 'Expenses',
//                         data: expensesData,
//                         borderColor: 'rgb(255, 99, 132)',
//                         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//                     },
//                     {
//                         label: 'Profit',
//                         data: profitData,
//                         borderColor: 'rgb(54, 162, 235)',
//                         backgroundColor: 'rgba(54, 162, 235, 0.5)',
//                     }
//                 ]
//             }
//         };
//     }, [transactions]);
//
//     return (
//         <div>
//             <h3>Line Chart (Trends over Time)</h3>
//             <Line data={chartData} />
//             <h3>Bar Chart (Comparison per Period)</h3>
//             <Bar data={chartData} />
//         </div>
//     );
// };
