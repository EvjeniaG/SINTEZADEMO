import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface SchoolData {
  name: string;
  address: string;
  phone: string;
  email: string;
  student_count: number;
  teacher_count: number;
  solar_panels: number;
  total_capacity: number;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [schoolData, setSchoolData] = useState<SchoolData>({
    name: 'Shkolla Fillore "Naim Frashëri"',
    address: 'Rruga e Dibrës, Tiranë',
    phone: '+355 69 123 4567',
    email: 'info@shkolla.al',
    student_count: 450,
    teacher_count: 35,
    solar_panels: 24,
    total_capacity: 12
  });
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (formData: SchoolData) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSchoolData(formData);
      setEditMode(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sinteza-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Paneli i Administratorit</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="px-4 py-2 bg-sinteza-blue text-white rounded-lg hover:bg-sinteza-blue/90 transition-colors"
        >
          {editMode ? 'Anulo' : 'Ndrysho të Dhënat'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Informacioni i Shkollës */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Informacioni i Shkollës</h2>
          {editMode ? (
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleSave({
                  ...schoolData,
                  name: formData.get('name') as string,
                  address: formData.get('address') as string,
                  phone: formData.get('phone') as string,
                  email: formData.get('email') as string,
                });
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Emri i Shkollës</label>
                <input
                  name="name"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sinteza-blue focus:ring-sinteza-blue"
                  defaultValue={schoolData.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresa</label>
                <input
                  name="address"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sinteza-blue focus:ring-sinteza-blue"
                  defaultValue={schoolData.address}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefoni</label>
                <input
                  name="phone"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sinteza-blue focus:ring-sinteza-blue"
                  defaultValue={schoolData.phone}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-sinteza-blue focus:ring-sinteza-blue"
                  defaultValue={schoolData.email}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Anulo
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sinteza-blue text-white rounded-lg hover:bg-sinteza-blue/90"
                >
                  Ruaj
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p><span className="font-medium">Emri:</span> {schoolData.name}</p>
              <p><span className="font-medium">Adresa:</span> {schoolData.address}</p>
              <p><span className="font-medium">Telefoni:</span> {schoolData.phone}</p>
              <p><span className="font-medium">Email:</span> {schoolData.email}</p>
            </div>
          )}
        </div>

        {/* Statistikat */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Statistikat</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Numri i Nxënësve</span>
              <span className="font-semibold">{schoolData.student_count}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Numri i Mësuesve</span>
              <span className="font-semibold">{schoolData.teacher_count}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Panele Diellore</span>
              <span className="font-semibold">{schoolData.solar_panels}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Kapaciteti Total (kW)</span>
              <span className="font-semibold">{schoolData.total_capacity}</span>
            </div>
          </div>
        </div>

        {/* Menaxhimi i Përdoruesve */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Menaxhimi i Përdoruesve</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Emri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roli
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statusi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Veprime
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Demo row */}
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Demo User
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    demo@sinteza.al
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Nxënës
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Aktiv
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-sinteza-blue hover:text-sinteza-blue/80">
                      Menaxho
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 