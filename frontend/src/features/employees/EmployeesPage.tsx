import { useState } from 'react';
import { useEmployees, useDeleteEmployee } from './hooks';
import { formatCurrency } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import EmployeeModal from './EmployeeModal';
import { Employee } from './types';

export default function EmployeesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const deleteMutation = useDeleteEmployee();

  const { data, isLoading } = useEmployees({
    page,
    page_size: 20,
    search: debouncedSearch,
  });

  return (
    <div className="flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employee Directory</h1>
        <button className="btn btn-primary" onClick={() => { setSelectedEmployee(null); setIsModalOpen(true); }}>
          Add Employee
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            style={{ minWidth: '300px' }}
          />
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="table-container mb-4">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Salary</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items.map((emp: Employee) => (
                    <tr key={emp.id}>
                      <td className="font-medium text-xs">{emp.employee_id}</td>
                      <td>
                        <div className="font-medium">{emp.first_name} {emp.last_name}</div>
                        <div className="text-xs text-muted">{emp.email}</div>
                      </td>
                      <td>{emp.job_title}</td>
                      <td>{emp.department}</td>
                      <td>{emp.country}</td>
                      <td className="font-medium text-emerald-400">{formatCurrency(emp.salary, emp.currency)}</td>
                      <td>
                        <span className={`badge ${emp.is_active ? 'badge-success' : 'badge-neutral'}`}>
                          {emp.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            className="btn btn-secondary text-xs py-1 px-3"
                            onClick={() => { setSelectedEmployee(emp); setIsModalOpen(true); }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn bg-[rgba(239,68,68,0.1)] text-red-500 hover:bg-red-500 hover:text-white border-transparent text-xs py-1 px-3 transition-colors"
                            onClick={() => setEmployeeToDelete(emp)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {data?.items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted py-8">
                        No employees found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-sm text-muted">
              <div>
                Showing page {data?.page} of {data?.total_pages} ({data?.total} total employees)
              </div>
              <div className="flex gap-2">
                <button 
                  className="btn btn-secondary" 
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-secondary"
                  disabled={!data || page >= data.total_pages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <EmployeeModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedEmployee(null); }}
        employee={selectedEmployee}
      />

      <ConfirmDialog
        open={!!employeeToDelete}
        title="Delete Employee"
        message={`Are you sure you want to delete ${employeeToDelete?.first_name} ${employeeToDelete?.last_name}? This action cannot be undone.`}
        confirmLabel={deleteMutation.isPending ? "Deleting..." : "Delete"}
        onConfirm={() => {
          if (employeeToDelete) {
            deleteMutation.mutate(employeeToDelete.id, {
              onSuccess: () => setEmployeeToDelete(null)
            });
          }
        }}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </div>
  );
}
