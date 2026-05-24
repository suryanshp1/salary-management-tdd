import { useSalaryByJobTitle } from '../hooks';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SalaryByJobTitleChart() {
  const { data, isLoading } = useSalaryByJobTitle();

  if (isLoading) return <div style={{ height: '300px' }} className="flex items-center justify-center"><LoadingSpinner /></div>;
  
  // Sort by highest average salary and take top 8 to keep the chart clean
  const sortedData = data ? [...data].sort((a, b) => Number(b.avg_salary) - Number(a.avg_salary)).slice(0, 8) : [];

  return (
    <div className="flex-col h-full w-full">

      
      {sortedData.length === 0 ? (
        <div style={{ height: '260px' }} className="flex items-center justify-center text-muted">No data available</div>
      ) : (
        <div style={{ height: '280px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorAvgH" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
              <YAxis type="category" dataKey="job_title" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={140} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                contentStyle={{ backgroundColor: 'rgba(15, 15, 20, 0.95)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)' }}
                itemStyle={{ color: '#fff', fontWeight: 500 }}
                formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Avg Salary']}
              />
              <Bar dataKey="avg_salary" name="Average Salary" fill="url(#colorAvgH)" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
