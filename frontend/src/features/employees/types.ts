export interface Employee {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  job_title: string;
  department: string;
  country: string;
  city?: string;
  salary: number;
  currency: string;
  employment_type: string;
  hire_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFilters {
  page?: number;
  page_size?: number;
  search?: string;
  country?: string;
  department?: string;
  job_title?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export type CreateEmployeeDTO = Omit<Employee, 'id' | 'employee_id' | 'email' | 'created_at' | 'updated_at' | 'is_active'>;
export type UpdateEmployeeDTO = Partial<CreateEmployeeDTO>;
