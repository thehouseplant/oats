import { useState, useEffect, type FormEvent } from 'react';
import { type Employee } from '../pages/Employees';

interface EmployeeFormProps {
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
  onClose: () => void;
  initialData?: Employee | null;
}

export default function EmployeeForm({ onSubmit, onClose, initialData }: EmployeeFormProps) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [office, setOffice] = useState('');
  const [status, setStatus] = useState('');
  const [pay, setPay] = useState('');

  // If initialData is provided (for editing), populate the form fields
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setTitle(initialData.title);
      setEmail(initialData.email);
      setAddress(initialData.address);
      setPhone(initialData.phone);
      setOrganization(initialData.organization);
      setDepartment(initialData.department);
      setOffice(initialData.office);
      setStatus(initialData.status);
      setPay(initialData.pay);
    } else {
      setName('');
      setTitle('');
      setEmail('');
      setAddress('');
      setPhone('');
      setOrganization('');
      setDepartment('');
      setOffice('');
      setStatus('');
      setPay('');
    }
  }, [initialData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({ name, title, email, address, phone, organization, department, office, status, pay });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Save
        </button>
      </div>
    </form>
  );
}
