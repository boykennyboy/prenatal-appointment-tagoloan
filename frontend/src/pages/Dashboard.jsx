import {
  Activity,
  Baby,
  Calendar,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  HeartPlus,
  HeartPulse,
  Hospital,
  Stethoscope,
  Syringe,
  User,
} from 'lucide-react';
import { Link } from 'react-router';
import Card from '../components/interfaces/cards/Card';
import { useAuthStore } from '../store/authStore.js';
import Title from '../components/Title.jsx';
import useDashboardStore from '../store/dashboardStore.js';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { data, pregnancy_data, appointment_data } = useDashboardStore();

  const getStatusColor = (status) => {
    let d_status = '';
    let classes = '';

    switch (status.toLowerCase()) {
      case 'completed':
        d_status = 'Completed';
        classes = 'bg-green-100 text-green-800';
        break;
      case 'first_trimester':
        d_status = '1st Trimester';
        classes = 'bg-blue-100 text-blue-800';
        break;
      case 'second_trimester':
        d_status = '2nd Trimester';
        classes = 'bg-teal-100 text-teal-800';
        break;
      case 'third_trimester':
        d_status = '3rd Trimester';
        classes = 'bg-purple-100 text-purple-800';
        break;
      case 'accepted':
        d_status = 'Accepted';
        classes = 'bg-green-100 text-green-800';
        break;
      case 'pending':
        d_status = 'Pending';
        classes = 'bg-yellow-100 text-yellow-800';
        break;
      default:
        d_status = 'Referral';
        classes = 'bg-gray-100 text-gray-800';
        break;
    }

    return { d_status, classes };
  };

  return (
    <div className='min-h-screen'>
      <Title title={'Dashboard'} />
      <div className='w-full'>
        {/* Statistics Cards - Responsive Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 ${
            user.role_id !== 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
          }`}
        >
          <Card
            title='Total Patients'
            value={data?.total_patients || 0}
            icon={User}
            iconBgColor='bg-blue-100'
            iconColor='text-blue-600'
          />
          {user.role_id !== 2 && (
            <Card
              title='Total Appointments'
              value={data?.total_appointments || 0}
              icon={CalendarCheck}
              path={'/admin/appointments'}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
          )}
          <div
            className={`${
              user.role_id !== 2 ? 'sm:col-span-2 lg:col-span-1 ' : ''
            }`}
          >
            <Card
              title='Total Pregnancy Trackings'
              value={data?.total_pregnancy_tracking || 0}
              icon={Baby}
              path={'/admin/pregnancy-trackings'}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
          </div>
        </div>

        {user.role_id !== 2 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6'>
            <Card
              title='1st Trimester'
              value={data?.total_first_trimester || 0}
              icon={HeartPulse}
              iconBgColor='bg-emerald-100'
              iconColor='text-emerald-600'
              path='/admin/pregnancy-trackings?pregnancy_status=first_trimester'
            />
            <Card
              title='2nd Trimester'
              value={data?.total_second_trimester || 0}
              icon={HeartPlus}
              iconBgColor='bg-emerald-100'
              iconColor='text-emerald-600'
              path='/admin/pregnancy-trackings?pregnancy_status=second_trimester'
            />
            <Card
              title='3rd Trimester'
              value={data?.total_third_trimester || 0}
              icon={Stethoscope}
              iconBgColor='bg-emerald-100'
              iconColor='text-emerald-600'
              path='/admin/pregnancy-trackings?pregnancy_status=third_trimester'
            />
            <Card
              title='Completed'
              value={data?.total_completed || 0}
              icon={Activity}
              iconBgColor='bg-emerald-100'
              iconColor='text-emerald-600'
              path='/admin/pregnancy-trackings?pregnancy_status=completed'
            />
          </div>
        )}
        {user.role_id !== 2 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6'>
            <Card
              title='Immunization Records'
              value={data?.total_immunization || 0}
              icon={Syringe}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
            <Card
              title='Prenatal Visit Records'
              value={data?.total_prenatal_visit || 'Loading ...'}
              icon={ClipboardList}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
            <div className='sm:col-span-2 lg:col-span-1'>
              <Card
                title='Total Out Patients'
                value={data?.total_out_patients || 0}
                icon={Hospital}
                iconBgColor='bg-blue-100'
                iconColor='text-blue-600'
              />
            </div>
          </div>
        )}

        {/* Main Content Grid - Responsive Layout */}
        <div
          className={`grid grid-cols-1 gap-6 ${
            user.role_id !== 2 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
          }`}
        >
          {/* Recent Referrals Table */}
          <div className='xl:col-span-2 bg-white rounded-lg shadow-md order-2 xl:order-1'>
            <div className='p-4 sm:p-6'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4'>
                Recent Pregnancy Tracking
              </h2>

              {/* Mobile Card View */}
              <div className='block sm:hidden space-y-3'>
                {pregnancy_data.map((referral) => (
                  <div
                    key={referral.id}
                    className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {referral.patient_name}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {referral.health_station}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          getStatusColor(referral.status).classes
                        }`}
                      >
                        {getStatusColor(referral.status).d_status}
                      </span>
                    </div>
                    <div className='text-sm text-gray-500'>
                      <p>To: {referral.referral_unit}</p>
                      <p>
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className='hidden sm:block overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Patient
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell'>
                        Referred To
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell'>
                        Heatlh Station
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {pregnancy_data.map((referral) => (
                      <tr key={referral.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {referral.patient_name}
                          </div>
                          <div className='text-sm text-gray-500 lg:hidden'>
                            {referral.referral_unit}
                          </div>
                          <div className='text-sm text-gray-500 md:hidden'>
                            {referral.health_station}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell'>
                          {referral.referral_unit}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell'>
                          {referral.health_station}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <span className='hidden sm:inline'>
                            {new Date(referral.created_at).toLocaleDateString()}
                          </span>
                          <span className='sm:hidden'>
                            {new Date(referral.created_at).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getStatusColor(referral.status).classes
                            }`}
                          >
                            {getStatusColor(referral.status).d_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments List */}
          {user.role_id !== 2 && (
            <div className='bg-white rounded-lg shadow-md order-1 xl:order-2'>
              <div className='p-4 sm:p-6'>
                <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4'>
                  Upcoming Appointments
                </h2>
                <div className='space-y-3 h-90 overflow-y-hidden hover:overflow-y-auto'>
                  {appointment_data.map((appointment) => (
                    <div
                      key={appointment.id}
                      className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-blue-100 rounded-full flex-shrink-0'>
                          <Calendar className='h-4 w-4 text-blue-600' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {appointment.patient_name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {appointment.status}
                          </p>
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <p className='text-xs text-gray-500'>
                          {appointment.appointment_date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <Link
                    to={'/admin/appointments'}
                    className='w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors'
                  >
                    View All Appointments
                    <ChevronRight className='ml-1 h-4 w-4' />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
