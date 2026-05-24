import { useState, useEffect } from 'react';
import { Employee, CreateEmployeeDTO } from './types';
import { useCreateEmployee, useUpdateEmployee } from './hooks';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

const initialFormState: CreateEmployeeDTO = {
  first_name: '',
  last_name: '',
  job_title: '',
  department: '',
  country: '',
  city: '',
  salary: 0,
  currency: 'USD',
  employment_type: 'full_time',
  hire_date: new Date().toISOString().split('T')[0],
};

export default function EmployeeModal({ isOpen, onClose, employee }: EmployeeModalProps) {
  const [formData, setFormData] = useState<CreateEmployeeDTO>(initialFormState);
  
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();

  useEffect(() => {
    if (employee) {
      setFormData({
        first_name: employee.first_name,
        last_name: employee.last_name,
        job_title: employee.job_title,
        department: employee.department,
        country: employee.country,
        city: employee.city || '',
        salary: employee.salary,
        currency: employee.currency,
        employment_type: employee.employment_type,
        hire_date: employee.hire_date,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [employee, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (employee) {
        await updateMutation.mutateAsync({ id: employee.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save employee:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value
    }));
  };

  if (!isOpen) return null;

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-primary)]">
          <h2 className="text-xl font-bold">{employee ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose} className="text-muted hover:text-white transition-colors">
            ✕
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <form id="employee-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">First Name</label>
              <input required name="first_name" value={formData.first_name} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Last Name</label>
              <input required name="last_name" value={formData.last_name} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Job Title</label>
              <input required name="job_title" value={formData.job_title} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Department</label>
              <input required name="department" value={formData.department} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Country</label>
              <input required name="country" value={formData.country} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">City</label>
              <input name="city" value={formData.city} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Salary</label>
              <input required type="number" min="0" step="0.01" name="salary" value={formData.salary} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="form-control">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="INR">INR</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Employment Type</label>
              <select name="employment_type" value={formData.employment_type} onChange={handleChange} className="form-control">
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted">Hire Date</label>
              <input required type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} className="form-control" />
            </div>
          </form>
        </div>
        
        <div className="p-6 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--bg-primary)] mt-auto">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" form="employee-form" disabled={isPending} className="btn btn-primary min-w-[100px]">
            {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
