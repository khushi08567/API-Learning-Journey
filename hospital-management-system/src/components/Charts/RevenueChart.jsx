import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function RevenueChart({ labels, values }) {
  const data = {
    labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue (₹)',
      data: values || [1850000, 2100000, 1950000, 2300000, 2150000, 2456000],
      borderColor: '#6EC89B',
      backgroundColor: (ctx) => {
        const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
        g.addColorStop(0, 'rgba(110, 200, 155, 0.3)');
        g.addColorStop(1, 'rgba(110, 200, 155, 0.02)');
        return g;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#6EC89B',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#2D3748',
        bodyColor: '#4A5568',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: { label: (ctx) => '₹' + ctx.raw.toLocaleString('en-IN') },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#718096', font: { size: 12 } } },
      y: {
        grid: { color: '#F0F4F8' },
        ticks: { color: '#718096', font: { size: 12 }, callback: (v) => '₹' + (v / 100000).toFixed(1) + 'L' },
      },
    },
  };

  return (
    <div className="chart-container" style={{ height: 280 }}>
      <Line data={data} options={options} />
    </div>
  );
}
