import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeeModal from '../EmployeeModal';

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('EmployeeModal', () => {
  it('renders correctly when open in Add mode', () => {
    renderWithClient(<EmployeeModal isOpen={true} onClose={() => {}} />);
    
    expect(screen.getByText('Add Employee')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders correctly when open in Edit mode', () => {
    const mockEmployee = {
      id: '123',
      employee_id: 'EMP-001',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@doe.com',
      job_title: 'Engineer',
      department: 'Engineering',
      country: 'US',
      salary: 100000,
      currency: 'USD',
      employment_type: 'full_time',
      hire_date: '2023-01-01',
      is_active: true,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    renderWithClient(<EmployeeModal isOpen={true} onClose={() => {}} employee={mockEmployee} />);
    
    expect(screen.getByText('Edit Employee')).toBeInTheDocument();
    
    // Check if the form is populated
    const firstNameInput = screen.getByDisplayValue('John');
    expect(firstNameInput).toBeInTheDocument();
    
    const salaryInput = screen.getByDisplayValue('100000');
    expect(salaryInput).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();
    renderWithClient(<EmployeeModal isOpen={true} onClose={handleClose} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
