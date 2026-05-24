import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from './api';

export const dashboardKeys = {
  all: ['insights'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
  salaryByCountry: () => [...dashboardKeys.all, 'salaryByCountry'] as const,
  salaryByJobTitle: (country?: string) => [...dashboardKeys.all, 'salaryByJobTitle', country] as const,
  departmentDistribution: () => [...dashboardKeys.all, 'departmentDistribution'] as const,
  countryDistribution: () => [...dashboardKeys.all, 'countryDistribution'] as const,
  salaryRanges: () => [...dashboardKeys.all, 'salaryRanges'] as const,
  topEarners: (limit: number) => [...dashboardKeys.all, 'topEarners', limit] as const,
};

export function useSalarySummary() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: dashboardApi.getSummary,
  });
}

export function useSalaryByCountry() {
  return useQuery({
    queryKey: dashboardKeys.salaryByCountry(),
    queryFn: dashboardApi.getSalaryByCountry,
  });
}

export function useSalaryByJobTitle(country?: string) {
  return useQuery({
    queryKey: dashboardKeys.salaryByJobTitle(country),
    queryFn: () => dashboardApi.getSalaryByJobTitle(country),
  });
}

export function useDepartmentDistribution() {
  return useQuery({
    queryKey: dashboardKeys.departmentDistribution(),
    queryFn: dashboardApi.getDepartmentDistribution,
  });
}

export function useSalaryRanges() {
  return useQuery({
    queryKey: dashboardKeys.salaryRanges(),
    queryFn: dashboardApi.getSalaryRanges,
  });
}

export function useTopEarners(limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.topEarners(limit),
    queryFn: () => dashboardApi.getTopEarners(limit),
  });
}
