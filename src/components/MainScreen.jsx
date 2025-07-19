import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit3,
  Menu,
  X,
  User,
  LogOut,
} from 'lucide-react';

export default function MainScreen({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      const mockData = [
        {
          id: 1,
          firstName: 'Venaika',
          lastName: 'Gfrg',
          company: 'Founder',
          phone: '+91 456456456',
          email: 'venaika@yopmail.com',
          designation: 'CEO',
        },
        {
          id: 2,
          firstName: 'Maheswaran',
          lastName: 'Ghgdf',
          company: 'CEO',
          phone: '+91 888888855',
          email: 'rgxfhb@yopmail.com',
          designation: 'Manager',
        },
      ];
      setStudents(mockData);
      setLoading(false);
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setProfileOpen(false); // Close dropdown before logout
    onLogout(); // Trigger parent logout function
  };

  const filteredStudents = students.filter((s) =>
    [s.firstName, s.lastName, s.email, s.company]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    alert('Add student logic goes here.');
  };

  const handleEditStudent = (student) => {
    setCurrentStudent({ ...student });
    setEditModalOpen(true);
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    setStudents(
      students.map((s) =>
        s.id === currentStudent.id ? { ...currentStudent } : s
      )
    );
    setEditModalOpen(false);
    setCurrentStudent(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 lg:static inset-y-0 left-0 bg-white w-64 shadow-xl transition-all duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-translate-x-0'
          }`}
      >
        <div className="h-16 bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-center justify-between px-6">
          <h2 className="text-lg font-bold tracking-tight">Contacts App</h2>
          <button
            className="lg:hidden hover:bg-red-800/20 p-1 rounded-md transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-4 py-3 text-rose-600 bg-rose-50 rounded-lg font-medium hover:bg-rose-100 transition-colors"
          >
            <Users size={20} />
            Contacts
          </a>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-rose-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-rose-800">Students</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
              >
                <User size={20} />
                <span className="font-medium">Profile</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full gap-2 px-4 py-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Search and Add Student */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
              <div className="relative w-full sm:w-1/2">
                <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 outline-none"
                />
              </div>
              <button className="flex items-center border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
            <button
              onClick={handleAddStudent}
              className="flex items-center bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors duration-200"
            >
              <Plus size={16} className="mr-2" />
              Add Student
            </button>
          </div>
        </div>

        {/* Table */}
        <main className="p-6 overflow-auto flex-1">
          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    />
                  </th>
                  <th className="p-4 text-left font-semibold text-gray-700">First Name</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Last Name</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Company</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Phone</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Designation</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                        <p className="mt-3 text-gray-500 font-medium">Loading students...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-gray-500 font-medium">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-t border-gray-100 hover:bg-rose-50/50 transition-colors duration-150"
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                      </td>
                      <td className="p-4 text-gray-800">{student.firstName}</td>
                      <td className="p-4 text-gray-800">{student.lastName}</td>
                      <td className="p-4 text-gray-800">{student.company}</td>
                      <td className="p-4 text-gray-800">{student.phone}</td>
                      <td className="p-4 text-gray-800">{student.email}</td>
                      <td className="p-4 text-gray-800">{student.designation}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-rose-600 hover:text-rose-800 transition-colors duration-150"
                        >
                          <Edit3 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>

        {/* Edit Modal */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h2 className="text-lg font-bold text-rose-800 mb-4">Edit Student</h2>
              <form onSubmit={handleUpdateStudent}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={currentStudent?.firstName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={currentStudent?.lastName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={currentStudent?.company || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={currentStudent?.phone || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={currentStudent?.email || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={currentStudent?.designation || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}