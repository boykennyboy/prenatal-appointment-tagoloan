import { Outlet } from 'react-router';
import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Header from './Header';
import {
  LayoutDashboard,
  CalendarCheck,
  Baby,
  Users,
  Stethoscope,
  Syringe,
  FileBarChart,
  HeartPulse,
  ClipboardList,
  Hospital,
  ClipboardPlus,
  BriefcaseMedical,
  Cpu,
  Bell,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';

const AdminLayout = () => {
  const [toggle, setToggle] = useState(false);
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    {
      name: 'Dashboard',
      link: 'dashboard',
      icon: <LayoutDashboard />,
      show: user.role_id === 1 || user.role_id === 2 || user.role_id === 3,
    },
    {
      name: 'Pregnancy Trackings',
      link: 'pregnancy-trackings',
      icon: <Baby />,
      show: user.role_id === 1 || user.role_id === 2 || user.role_id === 3,
    },
     {
      name: 'Appointments',
      link: 'appointments',
      icon: <CalendarCheck />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Out Patients',
      link: 'out-patients',
      icon: <Users />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Prenatal Visits',
      link: 'prenatal-visits',
      icon: <Stethoscope />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Immunization Records',
      link: 'immunization-records',
      icon: <Syringe />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Midwives',
      link: 'midwives',
      icon: <HeartPulse />,
      show: user.role_id === 1 || user.role_id === 2,
    },
    {
      name: 'Nurses',
      link: 'nurses',
      icon: <ClipboardPlus />,
      show: user.role_id === 1 || user.role_id === 2,
    },
    // {
    //   name: 'Barangay Workers',
    //   link: 'barangay-workers',
    //   icon: <ClipboardList />,
    // },
    {
      name: 'Health Stations',
      link: 'health-stations',
      icon: <Hospital />,
      show: user.role_id === 1,
    },
    {
      name: 'Doctor Management',
      link: 'doctor-management',
      icon: <BriefcaseMedical />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Notifications',
      link: 'notifications',
      icon: <Bell />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Activity Logs',
      link: 'activity-logs',
      icon: <Cpu />,
      show: user.role_id === 1 || user.role_id === 3,
    },
    {
      name: 'Reports',
      link: 'reports',
      icon: <FileBarChart />,
      show: user.role_id === 1 || user.role_id === 3,
    },
  ];

  return (
    <div className='flex'>
      {/* Desktop Sidebar */}
      <Sidebar
        toggle={toggle}
        setToggle={setToggle}
        mainLinks={mainLinks}
        user={user}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        mainLinks={mainLinks}
        user={user}
      />

      {/* Main Content */}
      <main
        className={`flex flex-col w-full py-3 px-0 sm:px-6 transition-all duration-300  ${
          toggle ? 'sm:max-w-[calc(100%-128px)]' : 'sm:max-w-[calc(100%-280px)]'
        }`}
      >
        <div className='py-3 px-4 sm:px-6'>
          <Header
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            user={user}
          />
          <div className='mt-6'>
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
