import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

import { useMemo } from 'react';

export default function ProfitLossChart({ profitLossData } : { profitLossData: { month: string, profitLoss: number }[] }) {
    const data = useMemo(() => ({
        labels: profitLossData.map(data => data.month), // X-axis labels
        datasets: [{
            label: 'Profit/Pierdere',
            data: profitLossData.map(data => data.profitLoss), // Y-axis data
            backgroundColor: profitLossData.map(data => data.profitLoss >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)'), // Conditional color
            borderColor: profitLossData.map(data => data.profitLoss >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'), // Conditional color
            borderWidth: 1
        }]
    }), [profitLossData]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false
    }), []);

    return (
        <div className='h-[450px]'>
            <h2 className='font-medium text-center'>Profit/Pierdere pentru anul {new Date().getFullYear()}</h2>
            <Line data={data} options={options} />
        </div>
    );
}
