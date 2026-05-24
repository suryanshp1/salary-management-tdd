import { useSalaryByCountry } from '../hooks';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SalaryByCountryChart() {
  const { data, isLoading } = useSalaryByCountry();

  if (isLoading) return <div style={{ height: '300px' }} className="flex items-center justify-center"><LoadingSpinner /></div>;
  if (!data || data.length === 0) return <div style={{ height: '300px' }} className="flex items-center justify-center text-muted">No data available</div>;

  return (
    <div style={{ height: '320px', width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="country" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} dy={10} />
          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} dx={-10} />
          <Tooltip 
            cursor={{fill: 'rgba(255,255,255,0.02)'}}
            contentStyle={{ backgroundColor: 'rgba(15, 15, 20, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)' }}
            itemStyle={{ color: '#fff', fontWeight: 500 }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="avg_salary" name="Average Salary" fill="url(#colorAvg)" radius={[6, 6, 0, 0]} barSize={14} />
          <Bar dataKey="min_salary" name="Minimum Salary" fill="url(#colorMin)" radius={[6, 6, 0, 0]} barSize={14} />
          <Bar dataKey="max_salary" name="Maximum Salary" fill="url(#colorMax)" radius={[6, 6, 0, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
