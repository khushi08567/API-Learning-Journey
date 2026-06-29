import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CalendarCheck, IndianRupee, BedDouble, TrendingUp, Clock, Stethoscope, Activity, CalendarPlus, FileText, FlaskConical, Siren } from 'lucide-react';
import StatsCard from '../../components/UI/StatsCard';
import StatusBadge from '../../components/UI/StatusBadge';
import RevenueChart from '../../components/Charts/RevenueChart';
import PatientVolumeChart from '../../components/Charts/PatientVolumeChart';
import DepartmentChart from '../../components/Charts/DepartmentChart';
import BedOccupancyChart from '../../components/Charts/BedOccupancyChart';

const RECENT_APPOINTMENTS = [
  { id: 'APT-2001', patient: 'Arjun Reddy', doctor: 'Dr. Anil Mehta', dept: 'Cardiology', time: '09:00 AM', status: 'confirmed' },
  { id: 'APT-2002', patient: 'Meera Krishnan', doctor: 'Dr. Vikram Joshi', dept: 'Dermatology', time: '09:30 AM', status: 'in_consultation' },
  { id: 'APT-2003', patient: 'Suresh Babu', doctor: 'Dr. Priya Nair', dept: 'Orthopedics', time: '10:00 AM', status: 'requested' },
  { id: 'APT-2004', patient: 'Lakshmi Iyer', doctor: 'Dr. Sanjay Gupta', dept: 'Neurology', time: '10:30 AM', status: 'completed' },
  { id: 'APT-2005', patient: 'Ravi Shankar', doctor: 'Dr. Anil Mehta', dept: 'Cardiology', time: '11:00 AM', status: 'confirmed' },
  { id: 'APT-2006', patient: 'Ananya Patel', doctor: 'Dr. Raman Pillai', dept: 'General Medicine', time: '11:30 AM', status: 'requested' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Hospital Dashboard</h1>
          <p style={{ color: '#718096', marginTop: 4 }}>Welcome back! Here's your hospital overview for today.</p>
        </div>
        <div className="flex gap-sm">
          <button className="btn btn-outline"><Clock size={16} /> Today: June 24, 2026</button>
          <button className="btn btn-primary"><FileText size={16} /> Generate Report</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        <div className="animate-fade-in-up delay-1"><StatsCard icon={Users} label="Total Patients" value={12458} trend="up" trendValue="+12.5%" color="green" /></div>
        <div className="animate-fade-in-up delay-2"><StatsCard icon={CalendarCheck} label="Today's Appointments" value={48} trend="up" trendValue="+8%" color="blue" /></div>
        <div className="animate-fade-in-up delay-3"><StatsCard icon={IndianRupee} label="Monthly Revenue" value={2456000} prefix="₹" trend="up" trendValue="+15.3%" color="teal" /></div>
        <div className="animate-fade-in-up delay-4"><StatsCard icon={BedDouble} label="Bed Occupancy" value={78} suffix="%" trend="down" trendValue="-3%" color="mint" /></div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card animate-fade-in-up delay-3">
          <div className="card-header">
            <h3><TrendingUp size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Revenue Trend</h3>
            <span className="badge badge-green">+15.3%</span>
          </div>
          <RevenueChart />
        </div>
        <div className="card animate-fade-in-up delay-4">
          <div className="card-header">
            <h3><Activity size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Patient Volume (This Week)</h3>
            <span className="badge badge-blue">321 total</span>
          </div>
          <PatientVolumeChart />
        </div>
      </div>

      {/* Appointments Table + Department Chart */}
      <div className="grid grid-2" style={{ marginBottom: 24 }}>
        <div className="card animate-fade-in-up delay-5">
          <div className="card-header">
            <h3><CalendarCheck size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Today's Appointments</h3>
            <span className="badge badge-green">{RECENT_APPOINTMENTS.length} scheduled</span>
          </div>
          <div className="data-table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_APPOINTMENTS.map((apt) => (
                  <tr key={apt.id}>
                    <td style={{ fontWeight: 500 }}>{apt.patient}</td>
                    <td>{apt.doctor}</td>
                    <td>{apt.time}</td>
                    <td><StatusBadge status={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card animate-fade-in-up delay-6">
          <div className="card-header">
            <h3><Stethoscope size={18} style={{ color: '#6FA8DC', marginRight: 8 }} />Department Distribution</h3>
          </div>
          <DepartmentChart />
        </div>
      </div>

      {/* Bed Occupancy + Quick Actions */}
      <div className="grid grid-2">
        <div className="card animate-fade-in-up delay-7">
          <div className="card-header">
            <h3><BedDouble size={18} style={{ color: '#6EC89B', marginRight: 8 }} />Bed Occupancy by Ward</h3>
            <span className="badge badge-blue">78% occupied</span>
          </div>
          <BedOccupancyChart />
        </div>

        <div className="card animate-fade-in-up delay-8">
          <div className="card-header"><h3>Quick Actions</h3></div>
          <div className="quick-actions">
            <button className="quick-action-btn" onClick={() => navigate('/book-appointment')}><CalendarPlus size={28} /> New Appointment</button>
            <button className="quick-action-btn" onClick={() => navigate('/patients')}><Users size={28} /> Add Patient</button>
            <button className="quick-action-btn" onClick={() => navigate('/doctors')}><Stethoscope size={28} /> Add Doctor</button>
            <button className="quick-action-btn" onClick={() => navigate('/laboratory')}><FlaskConical size={28} /> Order Test</button>
            <button className="quick-action-btn" onClick={() => navigate('/billing')}><FileText size={28} /> New Invoice</button>
            <button className="quick-action-btn" onClick={() => navigate('/emergency')}><Siren size={28} /> Emergency</button>
          </div>
        </div>
      </div>
    </div>
  );
}
