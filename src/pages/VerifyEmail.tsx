import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const VerifyEmail = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center relative overflow-hidden"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-emerald-500/5 to-amber-500/5" />
        
        {/* Content */}
        <div className="relative">
          {/* Email Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Konfirmo Email-in
          </h2>
          
          <p className="text-gray-600 mb-6">
            Ju kemi dërguar një email konfirmimi. Ju lutem kontrolloni inbox-in tuaj dhe klikoni në linkun e konfirmimit për të aktivizuar llogarinë tuaj.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/auth?mode=login"
              className="block w-full px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            >
              Kthehu te Hyrja
            </Link>
            
            <p className="text-sm text-gray-500">
              Nuk morët email? <button className="text-blue-500 hover:text-blue-600">Dërgo përsëri</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail; 