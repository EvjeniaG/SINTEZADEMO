import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types/auth';

// Forma për hyrje (Login)
const LoginForm = ({ onSubmit, loading, errors, onChange, formData }: {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errors: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formData: any;
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="text-center mb-8">
      <motion.div 
        className="relative inline-block"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-sinteza-blue via-sinteza-green to-sinteza-yellow bg-clip-text text-transparent pb-2">
          SINTEZA
        </h2>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-sinteza-blue via-sinteza-green to-sinteza-yellow rounded-full transform scale-x-0 animate-expandWidth" />
      </motion.div>
      <motion.h3 
        className="text-xl font-medium text-gray-700 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Hyr në llogarinë tënde
      </motion.h3>
      <motion.p
        className="text-sm text-gray-500 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Mirë se u ktheve! Ju lutemi hyni në llogarinë tuaj.
      </motion.p>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors.email ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80`}
          placeholder="Shkruani email-in tuaj"
        />
      </motion.div>
      {errors.email && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.email}
        </motion.p>
      )}
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Fjalëkalimi
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors.password ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80`}
          placeholder="Shkruani fjalëkalimin"
        />
      </motion.div>
      {errors.password && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.password}
        </motion.p>
      )}
    </div>

    {errors.submit && (
      <motion.p 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errors.submit}
      </motion.p>
    )}

    <motion.button
      type="submit"
      disabled={loading}
      className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sinteza-blue to-sinteza-yellow text-white font-medium shadow-lg transition-all duration-300 ${
        loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] hover:from-sinteza-blue hover:to-sinteza-yellow/90'
      }`}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Duke u ngarkuar...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Hyr
        </span>
      )}
    </motion.button>
  </form>
);

// Forma për regjistrim (Register)
const RegisterForm = ({ onSubmit, loading, errors, onChange, formData }: {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  errors: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  formData: any;
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="text-center mb-8">
      <motion.div 
        className="relative inline-block"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-sinteza-blue via-sinteza-green to-sinteza-yellow bg-clip-text text-transparent pb-2">
          SINTEZA
        </h2>
        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-sinteza-blue via-sinteza-green to-sinteza-yellow rounded-full transform scale-x-0 animate-expandWidth" />
      </motion.div>
      <motion.h3 
        className="text-xl font-medium text-gray-700 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Krijo një llogari të re
      </motion.h3>
      <motion.p
        className="text-sm text-gray-500 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Bashkohu me ne për të filluar udhëtimin tënd.
      </motion.p>
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Emri i plotë
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors.fullName ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80`}
          placeholder="Shkruani emrin tuaj të plotë"
        />
      </motion.div>
      {errors.fullName && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.fullName}
        </motion.p>
      )}
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors.email ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80`}
          placeholder="Shkruani email-in tuaj"
        />
      </motion.div>
      {errors.email && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.email}
        </motion.p>
      )}
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Fjalëkalimi
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors.password ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80`}
          placeholder="Shkruani fjalëkalimin"
        />
      </motion.div>
      {errors.password && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.password}
        </motion.p>
      )}
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Konfirmo fjalëkalimin
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={onChange}
          className={`w-full px-4 py-3 rounded-xl border bg-white/50 backdrop-blur-sm ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80`}
          placeholder="Konfirmo fjalëkalimin"
        />
      </motion.div>
      {errors.confirmPassword && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1 flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {errors.confirmPassword}
        </motion.p>
      )}
    </div>

    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Roli
      </label>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <select
          name="role"
          value={formData.role}
          onChange={onChange}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sinteza-blue/20 focus:border-sinteza-blue transition-all hover:bg-white/80"
        >
          <option value="nxenes">Nxënës</option>
          <option value="mesues">Mësues</option>
          <option value="admin">Admin</option>
        </select>
      </motion.div>
    </div>

    {errors.submit && (
      <motion.p 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errors.submit}
      </motion.p>
    )}

    <motion.button
      type="submit"
      disabled={loading}
      className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sinteza-blue to-sinteza-yellow text-white font-medium shadow-lg transition-all duration-300 ${
        loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:scale-[1.02] hover:from-sinteza-blue hover:to-sinteza-yellow/90'
      }`}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-3">
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Duke u ngarkuar...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
          Regjistrohu
        </span>
      )}
    </motion.button>
  </form>
);

const Auth = () => {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'nxenes' as UserRole
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateLoginForm = () => {
    const newErrors: any = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email është i detyrueshëm';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email nuk është i vlefshëm';
    }

    if (!formData.password) {
      newErrors.password = 'Fjalëkalimi është i detyrueshëm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Emri është i detyrueshëm';
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = 'Emri duhet të ketë të paktën 3 karaktere';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email është i detyrueshëm';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email nuk është i vlefshëm';
    }

    if (!formData.password) {
      newErrors.password = 'Fjalëkalimi është i detyrueshëm';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Fjalëkalimi duhet të ketë të paktën 6 karaktere';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Fjalëkalimet nuk përputhen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);
      if (mode === 'login') {
        if (!validateLoginForm()) return;
        await signIn(formData.email, formData.password);
        // Force a re-render of the header by triggering a userChange event
        window.dispatchEvent(new Event('userChange'));
        navigate('/dashboard');
      } else {
        if (!validateRegisterForm()) return;
        await signUp(formData.email, formData.password, formData.role as UserRole, formData.fullName);
        // Force a re-render of the header by triggering a userChange event
        window.dispatchEvent(new Event('userChange'));
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: (error as Error).message
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="w-full max-w-md">
        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-6 relative border border-white/60"
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-sinteza-blue/10 via-transparent to-sinteza-yellow/10 rounded-2xl blur-xl" />
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-sinteza-blue/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sinteza-yellow/10 rounded-full blur-3xl" />

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {mode === 'login' ? (
                <LoginForm
                  onSubmit={handleSubmit}
                  loading={loading}
                  errors={errors}
                  onChange={handleChange}
                  formData={formData}
                />
              ) : (
                <RegisterForm
                  onSubmit={handleSubmit}
                  loading={loading}
                  errors={errors}
                  onChange={handleChange}
                  formData={formData}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Switch Mode Link */}
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => {
                setFormData({
                  fullName: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  role: 'nxenes'
                });
                setErrors({});
                navigate(`/auth?mode=${mode === 'login' ? 'register' : 'login'}`);
              }}
              className="text-sm text-gray-600 hover:text-gray-800 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-lg px-3 py-1"
            >
              {mode === 'login' 
                ? "Nuk ke një llogari? Regjistrohu tani" 
                : "Ke një llogari? Hyr tani"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Shtojmë stilet për animacionin e vijës
const styles = document.createElement('style');
styles.innerHTML = `
  @keyframes expandWidth {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .animate-expandWidth {
    animation: expandWidth 0.8s ease-out forwards;
  }
`;
document.head.appendChild(styles);

export default Auth; 