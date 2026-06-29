import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PatientVolumeChart({ labels, values }) {
  const data = {
    labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Patients',
      data: values || [45, 52, 48, 61, 55, 38, 22],
      backgroundColor: 'rgba(111, 168, 220, 0.6)',
      borderColor: '#6FA8DC',
      borderWidth: 1,
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', titleColor: '#2D3748', bodyColor: '#4A5568', borderColor: '#E2E8F0', borderWidth: 1, cornerRadius: 8, padding: 12 } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#718096', font: { size: 12 } } },
      y: { grid: { color: '#F0F4F8' }, ticks: { color: '#718096', font: { size: 12 } } },
    },
  };

  return (
    <div className="chart-container" style={{ height: 280 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
