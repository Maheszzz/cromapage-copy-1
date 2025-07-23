import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddStudentModal = ({ isOpen, onClose, onAddStudent }) => {
  const [newStudent, setNewStudent] = useState({
    firstname: '',
    lastname: '',
    age: '',
    phone: '',
    mail: '',
    role: '',
    date: new Date().toISOString(),
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!newStudent.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!newStudent.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!newStudent.mail.trim()) newErrors.mail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent.mail)) {
      newErrors.mail = 'Please enter a valid email address';
    }
    if (!newStudent.age || newStudent.age <= 0) newErrors.age = 'Valid age is required';
    if (!newStudent.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9\s\-()]{7,15}$/.test(newStudent.phone)) {
      newErrors.phone = 'Please enter a valid phone number (7-15 digits, optional dashes/spaces)';
    }
    if (!newStudent.role.trim()) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onAddStudent({ ...newStudent, age: parseInt(newStudent.age) });
    setNewStudent({
      firstname: '',
      lastname: '',
      age: '',
      phone: '',
      mail: '',
      role: '',
      date: new Date().toISOString(),
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl max-w-md w-full border border-white/30">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 font-sans">Add New Student</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100/50 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {['firstname', 'lastname', 'age', 'phone', 'mail', 'role'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize font-sans">
                  {field === 'mail' ? 'Email' : field.replace(/([A-Z])/g, ' $1')}
                </label>
                <input
                  type={field === 'age' ? 'number' : field === 'mail' ? 'email' : 'text'}
                  name={field}
                  value={newStudent[field]}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 bg-gray-50/50 border rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 font-sans text-sm ${
                    errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder={`Enter ${field === 'mail' ? 'email' : field === 'phone' ? 'phone number (e.g., 123-456-7890)' : field}`}
                  required
                  aria-invalid={!!errors[field]}
                  aria-describedby={errors[field] ? `${field}-error` : undefined}
                />
                {errors[field] && (
                  <p id={`${field}-error`} className="mt-2 text-sm text-red-600 font-sans">{errors[field]}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100/50 rounded-lg transition-colors font-medium font-sans"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-600 text-white rounded-lg hover:from-gray-700 hover:to-gray-700 transition-all font-medium font-sans"
              >
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;