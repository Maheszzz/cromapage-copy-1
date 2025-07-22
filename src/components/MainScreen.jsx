import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const profileRef = useRef(null);

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
        const localStudents = getLocalStudents();
        const localIds = new Set(localStudents.map((s) => s.id || s.mail));
        const filteredApi = data.filter((s) => !localIds.has(s.id || s.mail));
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

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn');
    onLogout();
  };

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    if (!term) return true;
    if (filterType === 'all') {
      return [s.firstname, s.lastname, s.mail, s.role, s.phone, String(s.age)]
        .join(' ')
        .toLowerCase()
        .includes(term);
    }
    return String(s[filterType] || '').toLowerCase().includes(term);
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
    if (!window.confirm('Delete this student?')) return;
    try {
      const response = await fetch(`https://687b2e57b4bc7cfbda84e292.mockapi.io/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Delete failed');
      setStudents((prev) => prev.filter((s) => s.id !== id));
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
      if (!response.ok) throw new Error('Update failed');
      const updatedStudent = await response.json();
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
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

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'firstname', label: 'First Name' },
    { key: 'lastname', label: 'Last Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'age', label: 'Age' },
    { key: 'role', label: 'Role' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:w-64`}
      >
        <div className="flex items-center justify-between px-6 h-16 bg-rose-600 text-white">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-rose-700 rounded-full lg:hidden"
            aria-label="Close Sidebar"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
          >
            <User size={18} />
            Contacts
          </a>
          <button
            onClick={() => {
              setAddModalOpen(true);
              setSidebarOpen(false);
            }}
            className="flex items-center gap-2 px-4 py-2 w-full bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
          >
            <Plus size={18} />
            Add Contact
          </button>
        </nav>
      </aside>
      {/* Overlay when sidebar is open (on mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-0 lg:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="w-full bg-white shadow flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 hover:text-rose-600 block lg:hidden"
              aria-label="Open Sidebar"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-rose-700">Students</h1>
          </div>
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
              aria-label="Profile"
            >
              <User size={20} />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-xl py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-2 px-4 py-2 hover:bg-rose-50 text-gray-700"
                  aria-label="Logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>
        {/* Toolbar */}
        <div className="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative md:w-80 w-full">
              <Search className="absolute top-3 left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search${filterType !== 'all' ? ` by ${filterType}` : ''}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 shadow-sm outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${filterType === key
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {/* Add Button (for desktop only) */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="hidden md:flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 shadow-sm text-sm"
              aria-label="Add student"
            >
              <Plus size={16} />
              Add Student
            </button>
          </div>
        </div>
        {/* Table */}
        <main className="flex-1 p-6 overflow-x-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-4"></th>
                  <th className="p-4 text-left">First Name</th>
                  <th className="p-4 text-left">Last Name</th>
                  <th className="p-4 text-left">Age</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center p-6">Loading...</td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-6 text-gray-500">No students found.</td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t border-gray-100 hover:bg-rose-50">
                      <td className="p-4"><input type="checkbox" /></td>
                      <td className="p-4">{student.firstname}</td>
                      <td className="p-4">{student.lastname}</td>
                      <td className="p-4">{student.age}</td>
                      <td className="p-4">{student.phone}</td>
                      <td className="p-4">{student.mail}</td>
                      <td className="p-4">{student.role}</td>
                      <td className="p-4">{student.date ? new Date(student.date).toLocaleDateString() : ''}</td>
                      <td className="p-4 flex gap-2">
                        <button onClick={() => handleEditStudent(student)} title="Edit" className="text-rose-600 hover:text-rose-800">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteStudent(student.id)} title="Delete" className="text-red-600 hover:text-red-800">
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
        {editModalOpen && currentStudent && (
          <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
              <h3 className="text-lg font-bold text-rose-700 mb-4">Edit Student</h3>
              <form onSubmit={handleUpdateStudent} className="space-y-3">
                {['firstname', 'lastname', 'age', 'phone', 'mail', 'role'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm capitalize font-medium">{field}</label>
                    <input
                      name={field}
                      value={currentStudent[field] || ''}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                ))}
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700">Save</button>
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
