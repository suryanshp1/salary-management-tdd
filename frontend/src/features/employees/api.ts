import { fetchApi } from '@/api/client';
import { Employee, EmployeeFilters, PaginatedResponse, CreateEmployeeDTO, UpdateEmployeeDTO } from './types';

export const employeeApi = {
  getEmployees: (filters: EmployeeFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return fetchApi<PaginatedResponse<Employee>>(`/api/v1/employees${queryString ? `?${queryString}` : ''}`);
  },
  
  getEmployee: (id: string) => 
    fetchApi<Employee>(`/api/v1/employees/${id}`),
    
  createEmployee: (data: CreateEmployeeDTO) => 
    fetchApi<Employee>('/api/v1/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
  updateEmployee: ({ id, data }: { id: string; data: UpdateEmployeeDTO }) => 
    fetchApi<Employee>(`/api/v1/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    
  deleteEmployee: (id: string) => 
    fetchApi<void>(`/api/v1/employees/${id}`, {
      method: 'DELETE',
    }),
};
