import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import withRoleAccess from '../components/auth/withRoleAccess';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // Get current users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find and update the current user
      const updatedUsers = users.map((storedUser: any) => {
        if (storedUser.profile.id === user?.id) {
          return {
            ...storedUser,
            profile: {
              ...storedUser.profile,
              full_name: formData.full_name
            }
          };
        }
        return storedUser;
      });

      // Save updated users
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user in localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      localStorage.setItem('currentUser', JSON.stringify({
        ...currentUser,
        full_name: formData.full_name
      }));

      // Trigger user change event to update UI
      window.dispatchEvent(new Event('userChange'));

      setMessage({ type: 'success', text: 'Profili u përditësua me sukses!' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Ndodhi një gabim gjatë përditësimit të profilit.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Admin panel functions
  const handleUserManagement = () => {
    navigate('/admin/users');
  };

  const handleContentManagement = () => {
    navigate('/admin/content');
  };

  const handleAnalytics = () => {
    navigate('/admin/analytics');
  };

  const handleSystemSettings = () => {
    navigate('/admin/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
              Profili Im
            </h1>
            <p className="mt-1 text-sm text-gray-600">Menaxho informacionin personal dhe cilësimet e llogarisë</p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
                    Informacioni Personal
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="group inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Ndrysho
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="group inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isLoading ? 'Duke ruajtur...' : 'Ruaj'}
                    </button>
                  )}
                </div>

                {message && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emri i Plotë</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm transition-all duration-200"
                      />
                    ) : (
                      <p className="text-base text-gray-900">{user?.full_name}</p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-base text-gray-900">{user?.email}</p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Roli</label>
                    <p className="text-base text-gray-900 capitalize">{user?.role}</p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data e Regjistrimit</label>
                    <p className="text-base text-gray-900">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
                  Aktiviteti
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group flex items-center p-4 rounded-lg hover:bg-emerald-50/50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Kuize të Përfunduara</p>
                      <p className="text-2xl font-semibold text-emerald-600">{user?.progress?.quizzes_completed || 0}</p>
                    </div>
                  </div>

                  <div className="group flex items-center p-4 rounded-lg hover:bg-blue-50/50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Simulime të Përfunduara</p>
                      <p className="text-2xl font-semibold text-blue-600">{user?.progress?.simulations_completed || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Admin Panel - Only visible for admin users */}
          {user?.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400">
                    Paneli i Administratorit
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Users Management */}
                    <button
                      onClick={handleUserManagement}
                      className="group p-4 rounded-lg hover:bg-emerald-50/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Menaxhimi i Përdoruesve</h3>
                          <p className="text-sm text-gray-500">Shiko dhe menaxho përdoruesit</p>
                        </div>
                      </div>
                    </button>

                    {/* Content Management */}
                    <button
                      onClick={handleContentManagement}
                      className="group p-4 rounded-lg hover:bg-emerald-50/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Menaxhimi i Përmbajtjes</h3>
                          <p className="text-sm text-gray-500">Shto dhe modifiko kuize dhe simulime</p>
                        </div>
                      </div>
                    </button>

                    {/* Analytics */}
                    <button
                      onClick={handleAnalytics}
                      className="group p-4 rounded-lg hover:bg-emerald-50/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Analitika</h3>
                          <p className="text-sm text-gray-500">Shiko statistikat dhe raportet</p>
                        </div>
                      </div>
                    </button>

                    {/* System Settings */}
                    <button
                      onClick={handleSystemSettings}
                      className="group p-4 rounded-lg hover:bg-emerald-50/50 transition-all duration-200 text-left"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-base font-medium text-gray-900">Cilësimet e Sistemit</h3>
                          <p className="text-sm text-gray-500">Konfiguro cilësimet e sistemit</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withRoleAccess(Profile, {
  allowedRoles: ['admin', 'mesues', 'nxenes'],
  publicAccess: false
}); 