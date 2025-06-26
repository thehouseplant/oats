import { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';
import EmployeeForm from '../components/EmployeeForm';

// Define the structure of an Employee
export interface Employee {
  id: number;
  name: string;
  title: string;
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
                <button
                    type="button"
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 sm:w-auto"
                >
                    Add employee
                </button>
            </div>
        </div>
        <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">ID</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Name</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Title</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 bg-gray-900">
                                {employees.map((employee) => (
                                    <tr key={employee.id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{employee.id}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{employee.name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{employee.title}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-4">
                                            <button onClick={() => openEditModal(employee)} className="text-indigo-400 hover:text-indigo-300">
                                                Edit
                                            </button>
                                            <button onClick={() => openDeleteModal(employee)} className="text-red-400 hover:text-red-300">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
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
