import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { UserRole } from '../../types/auth';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

interface WithRoleAccessProps {
  allowedRoles: UserRole[];
  publicAccess?: boolean;
}

function withRoleAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { allowedRoles, publicAccess = false }: WithRoleAccessProps
) {
  // Përdorim React.memo për të optimizuar performancën
  const WithRoleAccessComponent = React.memo(function WithRoleAccessComponent(props: P) {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    // Nëse faqja është publike, shfaq komponentin
    if (publicAccess) {
      return <WrappedComponent {...props} />;
    }

    // Nëse jemi duke ngarkuar të dhënat, shfaq loading
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Duke kontrolluar aksesin...</p>
          </motion.div>
        </div>
      );
    }

    // Nëse përdoruesi nuk është i loguar, ridrejtoje te login
    if (!user) {
      return (
        <Navigate 
          to={`/auth?redirect=${encodeURIComponent(location.pathname)}`}
          replace 
        />
      );
    }

    // Nëse përdoruesi nuk ka akses, shfaq mesazh gabimi
    if (!allowedRoles.includes(user.role)) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="min-h-screen flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Akses i Pamjaftueshëm
            </h2>
            <p className="text-gray-600 mb-6">
              Na vjen keq, por nuk keni leje për të parë këtë seksion.
            </p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Kthehu Mbrapa
            </button>
          </div>
        </motion.div>
      );
    }

    // Nëse gjithçka është në rregull, shfaq komponentin
    return <WrappedComponent {...props} />;
  });

  // Vendosim një emër të duhur për komponentin për debugging
  WithRoleAccessComponent.displayName = `WithRoleAccess(${getDisplayName(WrappedComponent)})`;
  
  return WithRoleAccessComponent;
}

// Funksion ndihmës për të marrë emrin e komponentit
function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withRoleAccess;

// Përdorimi:
// export default withRoleAccess(DashboardComponent, { 
//   allowedRoles: ['admin', 'mesues'], 
//   publicAccess: false 
// }); 