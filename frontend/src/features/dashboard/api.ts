import { fetchApi } from '@/api/client';
import { 
  SalarySummary, 
  SalaryByCountry, 
  SalaryByJobTitle, 
  DepartmentDistribution, 
  CountryDistribution, 
  SalaryRange, 
  TopEarner 
} from './types';

export const dashboardApi = {
  getSummary: () => fetchApi<SalarySummary>('/api/v1/insights/summary'),
  getSalaryByCountry: () => fetchApi<SalaryByCountry[]>('/api/v1/insights/salary-by-country'),
  getSalaryByJobTitle: (country?: string) => 
    fetchApi<SalaryByJobTitle[]>(`/api/v1/insights/salary-by-job-title${country ? `?country=${country}` : ''}`),
  getDepartmentDistribution: () => fetchApi<DepartmentDistribution[]>('/api/v1/insights/department-distribution'),
  getCountryDistribution: () => fetchApi<CountryDistribution[]>('/api/v1/insights/country-distribution'),
  getSalaryRanges: () => fetchApi<SalaryRange[]>('/api/v1/insights/salary-ranges'),
  getTopEarners: (limit = 10) => fetchApi<TopEarner[]>(`/api/v1/insights/top-earners?limit=${limit}`),
};
