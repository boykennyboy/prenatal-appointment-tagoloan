import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import { toast } from 'sonner';
import LoginPage from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import GuestOnlyRoute from './protected_route/GuestOnlyRoute';
import AdminOnlyRoute from './protected_route/AdminOnlyRoute';
import OutPatients from './pages/out_patient/OutPatients';
import PrenatalVisits from './pages/prenatal_visit/PrenatalVisits';
import Reports from './pages/reports/Reports';
import ImmunizationRecords from './pages/immuzition_record/ImmunizationRecords';
import Appointments from './pages/appointment/Appointments';
import CreateAppointment from './pages/appointment/CreateAppointment';
import PregnancyTrackingRecords from './pages/pregnancy_tracking/PregnancyTrackingRecords';
import CreatePregnancyTracking from './pages/pregnancy_tracking/CreatePregnancyTracking';
import UserRecords from './pages/user_management/UserRecords';
import HealthStations from './pages/health_station/HealthStations';
import Midwives from './pages/midwives/Midwives';
import BarangayWorkers from './pages/barangay_workers/BarangayWorkers';
import Nurse from './pages/nurses/Nurse';
import RoleBasedRoute from './protected_route/RolebasedRoute';
import AppointmentReports from './pages/reports/AppointmentReports';
import PregnancyTrackingReports from './pages/reports/PregnancyTrackingReports';
import PrenatalVisitReports from './pages/reports/PrenatalVisitReports';
import OutPatientReports from './pages/reports/OutPatientReports';
import DoctorManagement from './pages/doctor_management/DoctorManagement';
import ActivityLogs from './pages/activity_logs/ActivityLogs';
import Notifications from './pages/notifications/Notifications';
import useNotificationStore from './store/notificationStore.js';
import useDashboardStore from './store/dashboardStore.js';
import echo from './utils/echo';
import { useAuthStore } from './store/authStore.js';

function App() {
  const { fetchUnreadCount } = useNotificationStore();

  const { fetchDashboardData } = useDashboardStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchUnreadCount();
    fetchDashboardData();
  }, []);

  useEffect(() => {
    console.log('Setting up Echo listener...');

    const channel = echo.channel('notifications');

    // Listen for the notify-user event
    channel.listen('.notify.user', (data) => {
      console.log('Received notification:', data);
      console.log('User role:', user.role_id);
      console.log('Target roles:', data.target_roles);

      // Check if current user's role is in the target roles
      if (data.target_roles && data.target_roles.includes(user.role_id)) {
        toast.success(data.message || 'New notification received!');
        fetchUnreadCount();
        console.log('Notification displayed for user role:', user.role_id);
      } else {
        console.log('Notification filtered out for user role:', user.role_id);
      }
    });

    // Optional: Listen for successful subscription
    channel.subscribed(() => {
      console.log('Successfully subscribed to notifications channel');
    });

    // Optional: Listen for subscription errors
    channel.error((error) => {
      console.error('Channel subscription error:', error);
    });

    return () => {
      console.log('Cleaning up Echo listener...');
      channel.stopListening('.notify.user');
      echo.leaveChannel('notifications');
    };
  }, [user]);

  const permissions = {
    dashboard: [1, 2, 3],
    appointments: [1, 3],
    create_appointment: [1, 3],
    pregnancy_trackings: [1, 2, 3],
    create_pregnancy_trackings: [1, 2],
    outPatients: [1, 3],
    prenatal_visits: [1, 3],
    immunization_records: [1, 3],
    midwives: [1, 2],
    nurses: [1, 2],
    health_stations: [1],
    reports: [1, 3],
    notifications: [1, 3],
    activity_logs: [1, 3],
    reports_appointments: [1, 3],
    reports_pregnancy_trackings: [1, 3],
    reports_prenatal_visits: [1, 3],
    reports_out_patients: [1, 3],
    doctor_management: [1, 3],
    user_management: [1],
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest-only */}
        <Route
          path='/'
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path='/admin'
          element={
            <AdminOnlyRoute>
              <AdminLayout />
            </AdminOnlyRoute>
          }
        >
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={permissions.dashboard}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path='dashboard'
            element={
              <RoleBasedRoute allowedRoles={permissions.dashboard}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path='appointments'
            element={
              <RoleBasedRoute allowedRoles={permissions.appointments}>
                <Appointments />
              </RoleBasedRoute>
            }
          />
          <Route
            path='appointments/create'
            element={
              <RoleBasedRoute allowedRoles={permissions.create_appointment}>
                <CreateAppointment />
              </RoleBasedRoute>
            }
          />
          <Route
            path='pregnancy-trackings'
            element={
              <RoleBasedRoute allowedRoles={permissions.pregnancy_trackings}>
                <PregnancyTrackingRecords />
              </RoleBasedRoute>
            }
          />
          <Route
            path='pregnancy-trackings/create'
            element={
              <RoleBasedRoute
                allowedRoles={permissions.create_pregnancy_trackings}
              >
                <CreatePregnancyTracking />
              </RoleBasedRoute>
            }
          />
          <Route
            path='out-patients'
            element={
              <RoleBasedRoute allowedRoles={permissions.outPatients}>
                <OutPatients />
              </RoleBasedRoute>
            }
          />
          <Route
            path='prenatal-visits'
            element={
              <RoleBasedRoute allowedRoles={permissions.prenatal_visits}>
                <PrenatalVisits />
              </RoleBasedRoute>
            }
          />
          <Route
            path='immunization-records'
            element={
              <RoleBasedRoute allowedRoles={permissions.immunization_records}>
                <ImmunizationRecords />
              </RoleBasedRoute>
            }
          />
          <Route
            path='midwives'
            element={
              <RoleBasedRoute allowedRoles={permissions.midwives}>
                <Midwives />
              </RoleBasedRoute>
            }
          />
          <Route
            path='health-stations'
            element={
              <RoleBasedRoute allowedRoles={permissions.health_stations}>
                <HealthStations />
              </RoleBasedRoute>
            }
          />
          <Route
            path='doctor-management'
            element={
              <RoleBasedRoute allowedRoles={permissions.doctor_management}>
                <DoctorManagement />
              </RoleBasedRoute>
            }
          />
          {/* <Route
            path='barangay-workers'
            element={
              <RoleBasedRoute allowedRoles={permissions.}>
                <Appointments />
              </RoleBasedRoute>
            }
          /> */}
          <Route
            path='nurses'
            element={
              <RoleBasedRoute allowedRoles={permissions.nurses}>
                <Nurse />
              </RoleBasedRoute>
            }
          />
          <Route
            path='reports'
            element={
              <RoleBasedRoute allowedRoles={permissions.reports}>
                <Reports />
              </RoleBasedRoute>
            }
          />
          <Route
            path='activity-logs'
            element={
              <RoleBasedRoute allowedRoles={permissions.activity_logs}>
                <ActivityLogs />
              </RoleBasedRoute>
            }
          />
          <Route
            path='notifications'
            element={
              <RoleBasedRoute allowedRoles={permissions.notifications}>
                <Notifications />
              </RoleBasedRoute>
            }
          />
          <Route
            path='reports/appointment-reports'
            element={
              <RoleBasedRoute allowedRoles={permissions.reports_appointments}>
                <AppointmentReports />
              </RoleBasedRoute>
            }
          />
          <Route
            path='reports/pregnancy-trackings'
            element={
              <RoleBasedRoute
                allowedRoles={permissions.reports_pregnancy_trackings}
              >
                <PregnancyTrackingReports />
              </RoleBasedRoute>
            }
          />
          <Route
            path='reports/prenatal-visits'
            element={
              <RoleBasedRoute
                allowedRoles={permissions.reports_prenatal_visits}
              >
                <PrenatalVisitReports />
              </RoleBasedRoute>
            }
          />
          <Route
            path='reports/out-patients'
            element={
              <RoleBasedRoute allowedRoles={permissions.reports_out_patients}>
                <OutPatientReports />
              </RoleBasedRoute>
            }
          />
          <Route
            path='users'
            element={
              <RoleBasedRoute allowedRoles={permissions.user_management}>
                <UserRecords />
              </RoleBasedRoute>
            }
          />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
