import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import withRoleAccess from '../components/auth/withRoleAccess';
import { UserProfile, UserRole } from '../types/auth';
import { useAuth } from '../hooks/useAuth';

interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  created_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const { user } = useAuth();

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      email: 'student@sinteza.al',
      full_name: 'Student Demo',
      role: 'student',
      status: 'active',
      created_at: '2024-03-20T10:00:00Z'
    },
    {
      id: '2',
      email: 'teacher@sinteza.al',
      full_name: 'Teacher Demo',
      role: 'teacher',
      status: 'active',
      created_at: '2024-03-20T10:00:00Z'
    },
    {
      id: '3',
      email: 'admin@sinteza.al',
      full_name: 'Admin Demo',
      role: 'admin',
      status: 'active',
      created_at: '2024-03-20T10:00:00Z'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadUsers = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('A jeni të sigurt që doni ta fshini këtë përdorues?')) {
      return;
    }

    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sinteza-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Menaxhimi i Përdoruesve</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Kërko përdorues..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sinteza-blue focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sinteza-blue focus:border-transparent"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Të gjithë rolet</option>
              <option value="student">Nxënës</option>
              <option value="teacher">Mësues</option>
              <option value="admin">Administrator</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Përdoruesi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roli
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statusi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data e Regjistrimit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Veprime
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="text-sm text-gray-900 bg-transparent border-0 cursor-pointer focus:ring-0"
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as 'student' | 'teacher' | 'admin')}
                    >
                      <option value="student">Nxënës</option>
                      <option value="teacher">Mësues</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Aktiv' : 'Joaktiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('sq-AL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Fshi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Eksporto me kontroll aksesi - vetëm admin
export default withRoleAccess(UserManagement, {
  allowedRoles: ['admin'],
  publicAccess: false
}); 