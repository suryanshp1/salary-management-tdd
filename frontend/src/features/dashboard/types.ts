export interface SalarySummary {
  total_employees: number;
  avg_salary: number;
  total_payroll: number;
  active_countries: number;
  active_departments: number;
}

export interface SalaryByCountry {
  country: string;
  min_salary: number;
  max_salary: number;
  avg_salary: number;
  median_salary: number;
  employee_count: number;
}

export interface SalaryByJobTitle {
  job_title: string;
  avg_salary: number;
  employee_count: number;
}

export interface DepartmentDistribution {
  department: string;
  employee_count: number;
}

export interface CountryDistribution {
  country: string;
  employee_count: number;
}

export interface SalaryRange {
  range_label: string;
  count: number;
}

export interface TopEarner {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  department: string;
  country: string;
  salary: number;
}
