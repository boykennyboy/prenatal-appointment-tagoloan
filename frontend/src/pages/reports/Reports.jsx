import { FileText, Heart, Calendar, Users } from 'lucide-react';
import LinkCards from '../../components/ui/LinkCards';
import Container from '../../components/ui/Container';
import Breadcrumb from '../../components/ui/Breadcrumb';

const Reports = () => {
  const reportLinks = [
    {
      icon: FileText,
      title: 'Appointment Reports',
      description:
        'View comprehensive records of all scheduled and completed prenatal appointments, including appointment history and notes.',
      linkTo: 'appointment-reports',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'bg-blue-500',
    },
    {
      icon: Heart,
      title: 'Pregnancy Tracking',
      description:
        'Monitor pregnancy progress with detailed tracking reports including weight, vitals, and developmental milestones.',
      linkTo: 'pregnancy-trackings',
      iconColor: 'bg-pink-500',
    },
    {
      icon: Calendar,
      title: 'Prenatal Visits',
      description:
        'Access detailed reports of prenatal visits, examination results, and healthcare provider recommendations.',
      linkTo: 'prenatal-visits',
      iconColor: 'bg-green-500',
    },
    {
      icon: Users,
      title: 'Out Patients',
      description:
        'Review outpatient consultation records, referrals, and follow-up care documentation for comprehensive patient management.',
      linkTo: 'out-patients',
      iconColor: 'bg-purple-500',
    },
  ];

  const Items = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Reports' },
  ];

  return (
    <Container title={'Reports'}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <Breadcrumb items={Items} />

        {/* Report Links Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 py-5'>
          {reportLinks.map((link, index) => (
            <LinkCards
              key={index}
              icon={link.icon}
              title={link.title}
              description={link.description}
              linkTo={link.linkTo}
              bgColor={link.bgColor}
              iconColor={link.iconColor}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Reports;
