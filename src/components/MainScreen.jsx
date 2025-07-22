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
  Trash2,
} from 'lucide-react';
import AddStudentModal from './AddStudentModal';

export default function MainScreen({ onLogout }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const profileRef = useRef(null);
  const filterRef = useRef(null);

  // Helper to get/set local students
  const LOCAL_KEY = 'localStudents';

  const getLocalStudents = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveLocalStudent = (student) => {
    const localStudents = getLocalStudents();
    localStudents.unshift(student);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(localStudents));
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://687b2e57b4bc7cfbda84e292.mockapi.io/users');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        // Remove duplicates (by id or email) and prepend local students
        const localStudents = getLocalStudents();
        const localIds = new Set(localStudents.map(s => s.id || s.mail));
        const filteredApi = data.filter(s => !localIds.has(s.id || s.mail));
        setStudents([...localStudents, ...filteredApi]);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
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

  // Close filter dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [filterOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setProfileOpen(false);
    onLogout();
  };

  // Enhanced filter logic
  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    if (filterType === 'all') {
      return [s.firstname, s.lastname, s.mail, s.role, s.phone, String(s.age)]
        .join(' ')
        .toLowerCase()
        .includes(term);
    }
    if (filterType === 'firstname') return s.firstname?.toLowerCase().includes(term);
    if (filterType === 'lastname') return s.lastname?.toLowerCase().includes(term);
    if (filterType === 'phone') return s.phone?.toLowerCase().includes(term);
    if (filterType === 'age') return String(s.age).includes(term);
    if (filterType === 'role') return s.role?.toLowerCase().includes(term);
    return true;
  });

  const handleAddStudent = async (newStudent) => {
    try {
      const response = await fetch('https://687b2e57b4bc7cfbda84e292.mockapi.io/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent),
      });
      if (!response.ok) throw new Error('Failed to add student');
      const addedStudent = await response.json();
      // Save to localStorage and update state
      saveLocalStudent(addedStudent);
      setStudents((prev) => [addedStudent, ...prev]);
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleEditStudent = (student) => {
    setCurrentStudent({ ...student });
    setEditModalOpen(true);
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const response = await fetch(`https://687b2e57b4bc7cfbda84e292.mockapi.io/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete student');
      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://687b2e57b4bc7cfbda84e292.mockapi.io/users/${currentStudent.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(currentStudent),
        }
      );
      if (!response.ok) throw new Error('Failed to update student');
      const updatedStudent = await response.json();
      setStudents(
        students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      setEditModalOpen(false);
      setCurrentStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Sidebar width in px (matches w-64)
  const SIDEBAR_WIDTH = 256;

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      {/* Sidebar */}
      <aside
        className={`
          h-full bg-white shadow-xl z-30 transition-all duration-300 ease-in-out
          fixed top-0 left-0
        `}
        style={{
          width: sidebarOpen ? SIDEBAR_WIDTH : 0,
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <div className="h-16 bg-gradient-to-r from-rose-600 to-red-700 text-white flex items-center justify-between px-6">
          <h2 className="text-lg font-bold tracking-tight">Contacts App</h2>
          <button
            className="hover:bg-red-800/20 p-1 rounded-md transition-colors"
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

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out`}
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
        }}
      >
        {/* Header */}
        <header className="h-16 bg-white shadow-sm px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-rose-600 transition-colors"
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
                  placeholder={`Search students${filterType !== 'all' ? ` by ${filterType}` : ''}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all duration-200 outline-none"
                />
              </div>
              <div className="relative" ref={filterRef}>
                <button
                  type="button"
                  className="flex items-center border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => setFilterOpen((v) => !v)}
                >
                  <Filter size={16} className="mr-2" />
                  Filter
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {filterOpen && (
                  <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${filterType === 'all' ? 'font-semibold text-rose-600' : ''}`}
                      onClick={() => { setFilterType('all'); setFilterOpen(false); }}
                    >
                      All
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${filterType === 'firstname' ? 'font-semibold text-rose-600' : ''}`}
                      onClick={() => { setFilterType('firstname'); setFilterOpen(false); }}
                    >
                      First Name
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${filterType === 'lastname' ? 'font-semibold text-rose-600' : ''}`}
                      onClick={() => { setFilterType('lastname'); setFilterOpen(false); }}
                    >
                      Last Name
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${filterType === 'phone' ? 'font-semibold text-rose-600' : ''}`}
                      onClick={() => { setFilterType('phone'); setFilterOpen(false); }}
                    >
                      Phone
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${filterType === 'age' ? 'font-semibold text-rose-600' : ''}`}
                      onClick={() => { setFilterType('age'); setFilterOpen(false); }}
                    >
                      Age
                    </button>
                    <button
                      className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${filterType === 'role' ? 'font-semibold text-rose-600' : ''}`}
                      onClick={() => { setFilterType('role'); setFilterOpen(false); }}
                    >
                      Role
                    </button>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setAddModalOpen(true)}
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
                  <th className="p-4 text-left font-semibold text-gray-700">Age</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Phone</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Role</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                  <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center p-8">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                        <p className="mt-3 text-gray-500 font-medium">Loading students...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500 font-medium">
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
                      <td className="p-4 text-gray-800">{student.firstname}</td>
                      <td className="p-4 text-gray-800">{student.lastname}</td>
                      <td className="p-4 text-gray-800">{student.age}</td>
                      <td className="p-4 text-gray-800">{student.phone}</td>
                      <td className="p-4 text-gray-800">{student.mail}</td>
                      <td className="p-4 text-gray-800">{student.role}</td>
                      <td className="p-4 text-gray-800">
                        {new Date(student.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-rose-600 hover:text-rose-800 transition-colors duration-150"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-150"
                        >
                          <Trash2 size={16} />
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
                      name="firstname"
                      value={currentStudent?.firstname || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastname"
                      value={currentStudent?.lastname || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={currentStudent?.age || ''}
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
                      name="mail"
                      value={currentStudent?.mail || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={currentStudent?.role || ''}
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

        {/* Add Student Modal */}
        <AddStudentModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAddStudent={handleAddStudent}
        />
      </div>
    </div>
  );
}