import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DepartmentChart({ labels, values }) {
  const data = {
    labels: labels || ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'General', 'Ophthalmology', 'Emergency'],
    datasets: [{
      data: values || [320, 180, 250, 290, 150, 410, 120, 280],
      backgroundColor: ['#A8D5BA', '#A8C8E8', '#B5EAD7', '#C7CEEA', '#FFD3B5', '#D5E8D4', '#E8D5E8', '#FFDAB9'],
      borderColor: '#fff',
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { padding: 16, usePointStyle: true, pointStyle: 'circle', font: { size: 12 } } },
      tooltip: { backgroundColor: '#fff', titleColor: '#2D3748', bodyColor: '#4A5568', borderColor: '#E2E8F0', borderWidth: 1, cornerRadius: 8, padding: 12 },
    },
  };

  return (
    <div className="chart-container" style={{ height: 280 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
