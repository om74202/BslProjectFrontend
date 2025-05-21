import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './Routes/ProtectedRoute';
import { DashboardLayout } from './layout/DashboardLayout';
import OrgInfo from './Settings/OrganisationInfo';


import {
  PlantDashboard,
  LineDashboard,
  DriveMonitoring,
  QualityMonitoring,
  DataSheets,
  UserManagement
} from './pages/PlantDashboard';
import Settings from './Settings/Settings';
import TorqueMonitoring from './pages/torqueComponents/TorqueMonitoring';

function App() {
  return (
    <>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested Routes under /dashboard */}
          <Route index element={<PlantDashboard />} />
          <Route path="line-dashboard" element={<LineDashboard />} />
          <Route path="torque-monitoring" element={<TorqueMonitoring />} />
          <Route path="drive-monitoring" element={<DriveMonitoring />} />
          <Route path="quality-monitoring" element={<QualityMonitoring />} />
          <Route path="data-sheets" element={<DataSheets />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="settings/:org" element={<OrgInfo />} />
        </Route>

        {/* Catch-all: redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
