import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BedOccupancyChart() {
  const data = {
    labels: ['General Ward', 'ICU', 'Pediatric', 'Maternity', 'Surgery', 'Private'],
    datasets: [
      { label: 'Occupied', data: [42, 18, 12, 8, 15, 22], backgroundColor: 'rgba(111, 168, 220, 0.7)', borderRadius: 6, borderSkipped: false },
      { label: 'Available', data: [8, 2, 8, 12, 5, 8], backgroundColor: 'rgba(168, 213, 186, 0.7)', borderRadius: 6, borderSkipped: false },
    ],
  };

  const options = {
    responsive: true, maintainAspectRatio: false, indexAxis: 'y',
    plugins: { legend: { position: 'top', labels: { usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } }, tooltip: { backgroundColor: '#fff', titleColor: '#2D3748', bodyColor: '#4A5568', borderColor: '#E2E8F0', borderWidth: 1, cornerRadius: 8, padding: 12 } },
    scales: {
      x: { stacked: true, grid: { color: '#F0F4F8' }, ticks: { color: '#718096' } },
      y: { stacked: true, grid: { display: false }, ticks: { color: '#718096', font: { size: 12 } } },
    },
  };

  return (
    <div className="chart-container" style={{ height: 280 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
