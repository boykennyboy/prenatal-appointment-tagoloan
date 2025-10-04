import { useLocation } from 'react-router';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Container from '../../components/ui/Container';
import FormWizard from '../../components/interfaces/FormWizard';

const CreatePregnancyTracking = () => {
  const location = useLocation();
  const { row } = location.state || {};
  const breadcrumbItems = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Pregnancy Tracking', to: '/admin/pregnancy-trackings' },
    { label: row ? 'Edit Pregnancy Tracking' : 'Create Pregnancy Tracking' },
  ];
  return (
    <Container
      title={row ? 'Edit Pregnancy Tracking' : 'Create Pregnancy Tracking'}
    >
      <Breadcrumb items={breadcrumbItems} />
      <div className='w-full'>
        <div className='px-2 py-4 sm:px-6'>
          <FormWizard row={row} />
        </div>
      </div>
    </Container>
  );
};

export default CreatePregnancyTracking;
