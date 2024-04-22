import {Pie} from "react-chartjs-2";
import 'chart.js/auto';

export default function ExpenseChart({totalExpensesByCategory}: {
    totalExpensesByCategory: { category: string, totalAmount: number }[]
}) {
    const data = {
        labels: totalExpensesByCategory.map(({category}) => category),
        datasets: [{
            data: totalExpensesByCategory.map(({totalAmount}) => totalAmount),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1

        }]
    }
    const options = {
        plugins: {
            legend:{
                display: false
            }
        }
    }
    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-lg font-semibold'>Expenses By Category</h2>
            <div className='flex gap-4'>
                <div className='w-48 h-48'>
                    <Pie data={data} options={options}/>
                </div>
                <div>
                    {totalExpensesByCategory.map(({category, totalAmount}) => (
                        <div key={category} className='items-center'>
                            <span>{category}:</span>
                            <span> ${totalAmount}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}