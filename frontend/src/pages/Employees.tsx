import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

// Define the structure of an Employee
export interface Employee {
  id: number;
  name: string;
  title: string;
  email: string;
  address: string;
  phone: string;
  organization: string;
  department: string;
  office: string;
  status: string;
  pay: string;
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for controlling modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Fetch employees from the API
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/v1/employees');
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees. Is the server running?');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handler to add a new employee
  const handleAddEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    try {
      await axios.post('http://localhost:3000/api/v1/employees', employeeData);
      setIsAddModalOpen(false);
      fetchEmployees(); // Refetch to show the new employee
    } catch (err) {
      console.error('Failed to add employee', err);
      // You could set an error state here to show in the modal
    }
  };

  // Handler to update an employee
  const handleUpdateEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    if (!selectedEmployee) return;
    try {
      await axios.put(`http://localhost:3000/api/v1/employees/${selectedEmployee.id}`, employeeData);
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees(); // Refetch to show the updated employee
    } catch (err) {
      console.error('Failed to update employee', err);
    }
  };

  // Handler to delete an employee
  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return;
    try {
      await axios.delete(`http://localhost:3000/api/v1/employees/${selectedEmployee.id}`);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
      fetchEmployees(); // Refetch to show the list without the deleted employee
    } catch (err) {
        console.error('Failed to delete employee', err);
    }
  };

  // Open the edit modal and set the selected employee
  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  }

  // Open the delete modal
  const openDeleteModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 bg-red-900 border border-red-400 text-red-100 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-white">Employees</h1>
          <p className="mt-2 text-sm text-gray-400">
            A list of all the employees in your organization.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add employee
          </Button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.title}</TableCell>
                <TableCell>
                  <Button onClick={() => openEditModal(employee)}>
                    Edit
                  </Button>
                  <Button onClick={() => openDeleteModal(employee)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee">
        <EmployeeForm onSubmit={handleAddEmployee} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee">
        <EmployeeForm onSubmit={handleUpdateEmployee} onClose={() => setIsEditModalOpen(false)} initialData={selectedEmployee} />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Employee">
        <div>
          <p className="text-sm text-gray-400">
            Are you sure you want to delete "{selectedEmployee?.name}"? This action cannot be undone.
          </p>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteEmployee}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
