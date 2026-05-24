import { useSalarySummary } from './hooks';
import { formatCurrency } from '@/lib/utils';
import { Users, DollarSign, Globe } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import SalaryByCountryChart from './charts/SalaryByCountryChart';
import SalaryByJobTitleChart from './charts/SalaryByJobTitleChart';

export default function DashboardPage() {
  const { data: summary, isLoading } = useSalarySummary();

  if (isLoading) return <LoadingSpinner />;
  if (!summary) return <div>Failed to load data</div>;

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Executive Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[rgba(99,102,241,0.1)] text-indigo-400">
              <Users size={24} color="var(--accent-primary)" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Employees</p>
              <h3 className="text-2xl font-bold">{summary.total_employees.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[rgba(16,185,129,0.1)] text-emerald-400">
              <DollarSign size={24} color="var(--success)" />
            </div>
            <div>
              <p className="text-sm text-muted">Total Payroll</p>
              <h3 className="text-2xl font-bold">{formatCurrency(summary.total_payroll)}</h3>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[rgba(245,158,11,0.1)] text-amber-400">
              <DollarSign size={24} color="var(--warning)" />
            </div>
            <div>
              <p className="text-sm text-muted">Average Salary</p>
              <h3 className="text-2xl font-bold">{formatCurrency(summary.avg_salary)}</h3>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-[rgba(236,72,153,0.1)] text-pink-400">
              <Globe size={24} color="#ec4899" />
            </div>
            <div>
              <p className="text-sm text-muted">Active Countries</p>
              <h3 className="text-2xl font-bold">{summary.active_countries}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="card">
            <h2 className="text-lg font-semibold mb-4">Salary Statistics by Country</h2>
            <SalaryByCountryChart />
        </div>
        <div className="card">
            <h2 className="text-lg font-semibold mb-4">Top Average Salaries by Job Title</h2>
            <SalaryByJobTitleChart />
        </div>
      </div>
    </div>
  );
}
