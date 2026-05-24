import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '../DashboardPage';

// We mock Recharts to prevent responsive container errors in JSDOM
vi.mock('recharts', async () => {
  const OriginalRechartsModule = await vi.importActual('recharts');
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 300 }}>{children}</div>
    ),
  };
});

// Mock the hooks
vi.mock('../hooks', () => ({
  useSalarySummary: () => ({
    data: {
      total_employees: 10000,
      total_payroll: 890000000,
      avg_salary: 89000,
      active_countries: 15
    },
    isLoading: false,
    isError: false,
  }),
  useSalaryByCountry: () => ({
    data: [
      { country: 'US', avg_salary: 100000, min_salary: 50000, max_salary: 150000 }
    ],
    isLoading: false,
  }),
  useSalaryByJobTitle: () => ({
    data: [
      { job_title: 'Engineer', avg_salary: 120000 }
    ],
    isLoading: false,
  }),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('DashboardPage', () => {
  it('renders summary cards with correct data', () => {
    renderWithClient(<DashboardPage />);
    
    // Check if summary cards are rendered
    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('10,000')).toBeInTheDocument();
    
    expect(screen.getByText('Total Payroll')).toBeInTheDocument();
    expect(screen.getByText('$890,000,000')).toBeInTheDocument();
    
    expect(screen.getByText('Average Salary')).toBeInTheDocument();
    expect(screen.getByText('$89,000')).toBeInTheDocument();
  });

  it('renders the charts section headers', () => {
    renderWithClient(<DashboardPage />);
    
    expect(screen.getByText('Salary Statistics by Country')).toBeInTheDocument();
    expect(screen.getByText('Top Average Salaries by Job Title')).toBeInTheDocument();
  });
});
