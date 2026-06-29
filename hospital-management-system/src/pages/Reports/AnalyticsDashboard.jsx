import { BarChart3, TrendingUp, Sparkles, Calendar } from 'lucide-react';
import RevenueChart from '../../components/Charts/RevenueChart';
import PatientVolumeChart from '../../components/Charts/PatientVolumeChart';
import DepartmentChart from '../../components/Charts/DepartmentChart';
import BedOccupancyChart from '../../components/Charts/BedOccupancyChart';
import { useState } from 'react';
import { aiApi } from '../../services/api';

export default function AnalyticsDashboard() {
  const [aiInsight, setAiInsight] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const getInsights = async () => {
    setLoadingAI(true);
    const { data } = await aiApi.operationsInsights('Analyze hospital performance');
    setAiInsight(data.insights);
    setLoadingAI(false);
  };

  return (
    <div>
      <div className="page-header">
        <div><h1>Reports & Analytics</h1><p style={{ color: '#718096' }}>Comprehensive hospital performance overview</p></div>
        <div className="flex gap-sm">
          <button className="btn btn-outline"><Calendar size={16} /> Last 6 Months</button>
          <button className="btn btn-primary" onClick={getInsights} disabled={loadingAI}>
            <Sparkles size={16} /> {loadingAI ? 'Analyzing...' : 'AI Insights'}
          </button>
        </div>
      </div>

      {aiInsight && (
        <div className="card animate-fade-in-up" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #E8F5E9, #E3F2FD)', border: '1px solid #C8E6C9' }}>
          <div className="card-header"><h3><Sparkles size={18} style={{ color: '#6EC89B', marginRight: 8 }} />AI Operations Insights</h3></div>
          <div style={{ whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.7 }}>{aiInsight}</div>
        </div>
      )}

      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card animate-fade-in-up delay-1">
          <div className="card-header"><h3><TrendingUp size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Revenue Trend</h3></div>
          <RevenueChart />
        </div>
        <div className="card animate-fade-in-up delay-2">
          <div className="card-header"><h3><BarChart3 size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Patient Volume</h3></div>
          <PatientVolumeChart />
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-3">
          <div className="card-header"><h3>Department Distribution</h3></div>
          <DepartmentChart />
        </div>
        <div className="card animate-fade-in-up delay-4">
          <div className="card-header"><h3>Bed Occupancy</h3></div>
          <BedOccupancyChart />
        </div>
      </div>
    </div>
  );
}
