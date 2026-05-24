import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeesPage from '../EmployeesPage';
import { BrowserRouter } from 'react-router-dom';

// Mock the hooks
vi.mock('../hooks', () => ({
  useEmployees: () => ({
    data: {
      items: [
        {
          id: '1',
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
          is_active: true
        }
      ],
      total: 1,
      page: 1,
      page_size: 20,
      total_pages: 1
    },
    isLoading: false,
    isError: false,
  }),
  useDeleteEmployee: () => ({
    mutate: vi.fn(),
  }),
  useCreateEmployee: () => ({
    mutate: vi.fn(),
  }),
  useUpdateEmployee: () => ({
    mutate: vi.fn(),
  }),
}));

const queryClient = new QueryClient();

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('EmployeesPage', () => {
  it('renders employee list correctly', () => {
    renderWithClient(<EmployeesPage />);
    
    // Check if employee data is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('john@doe.com')).toBeInTheDocument();
  });

  it('handles search input', () => {
    renderWithClient(<EmployeesPage />);
    
    const searchInput = screen.getByPlaceholderText('Search employees...');
    fireEvent.change(searchInput, { target: { value: 'Jane' } });
    
    expect(searchInput).toHaveValue('Jane');
  });

  it('opens delete confirmation dialog', async () => {
    renderWithClient(<EmployeesPage />);
    
    // Find the delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    // Verify dialog appears
    await waitFor(() => {
      expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    });
  });
});
