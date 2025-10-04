import Container from '../../components/ui/Container';
import Legend from '../../components/forms/appointment/Legend';
import Breadcrumb from '../../components/ui/Breadcrumb';
import AppointmentForm from '../../components/forms/appointment/AppointmentForm';
import { useLocation } from 'react-router';

// Main Component
const CreateAppointment = () => {
  const location = useLocation();
  const { row, type } = location.state || {};

  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Appointments', to: '/admin/appointments' },
    { label: 'Create Appointment' },
  ];

  return (
    <Container title={'Create Appointment'}>
      <Breadcrumb items={breadcrumbItems} />
      <AppointmentForm row={row} type={type} />
      <Legend />
    </Container>
  );
};

export default CreateAppointment;
