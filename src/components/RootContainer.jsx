import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Login from '@/components/auth/Login';
import Register from '@/components/auth/Register';
import App from '@/components/layout/App';
import { AppProvider } from '@/core/AppContext';
import ProtectedRoute from '@/core/ProtectedRoute';

function RootContainer() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={(
          <ProtectedRoute>
            <AppProvider>
              <App />
            </AppProvider>
          </ProtectedRoute>
        )}
      />
    </Routes>
  );
}

export default RootContainer;
