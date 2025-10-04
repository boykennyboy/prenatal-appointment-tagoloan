import InfoCell from '../components/ui/InfoCell';

export const pregnancy_tracking_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[5%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    width: 'w-[5%]',
  },
  {
    key: 'contact',
    title: 'Contact',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      if (!value) return '';
      if (value.startsWith('63')) {
        return '0' + value.slice(2);
      }
      return value;
    },
  },
  {
    key: 'patient_short_address',
    title: 'Address',
    sortable: false,
    width: 'w-[15%]',
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'pregnancy_status',
    title: 'Status',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      let colorClass = '';
      let status = '';
      switch (value) {
        case 'completed':
          colorClass = 'bg-green-100 text-green-800';
          status = 'Completed';
          break;
        case 'first_trimester':
          colorClass = 'bg-blue-100 text-blue-800';
          status = '1st Trimester';
          break;
        case 'second_trimester':
          colorClass = 'bg-teal-100 text-teal-800';
          status = '2nd Trimester';
          break;
        case 'third_trimester':
          colorClass = 'bg-purple-100 text-purple-800';
          status = '3rd Trimester';
          break;
        case 'accepted':
          status = 'Accepted';
          colorClass = 'bg-green-100 text-green-800';
          break;
        case 'pending':
          status = 'Pending';
          colorClass = 'bg-yellow-100 text-yellow-800';
          break;
        default:
          colorClass = 'bg-gray-200 text-gray-800';
      }
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
        >
          {status ? status : 'Refferal'}
        </span>
      );
    },
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },

  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'bemoc',
    hidden: true,
  },
  {
    key: 'cemoc',
    hidden: true,
  },
  {
    key: 'firstname',
    hidden: true,
  },
  {
    key: 'lastname',
    hidden: true,
  },
  {
    key: 'middlename',
    hidden: true,
  },
  {
    key: 'birth_date',
    hidden: true,
  },
  {
    key: 'birth_place',
    hidden: true,
  },
  {
    key: 'religion',
    hidden: true,
  },
  {
    key: 'contact_person_name',
    hidden: true,
  },
  {
    key: 'contact_person_number',
    hidden: true,
  },
  {
    key: 'contact_person_relationship',
    hidden: true,
  },
  {
    key: 'patient_id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
  {
    key: 'barangay_worker_id',
    hidden: true,
  },
  {
    key: 'midwife_id',
    hidden: true,
  },
  {
    key: 'region',
    hidden: true,
  },
  {
    key: 'province',
    hidden: true,
  },
  {
    key: 'municipality',
    hidden: true,
  },
  {
    key: 'barangay',
    hidden: true,
  },
  {
    key: 'region_id',
    hidden: true,
  },
  {
    key: 'province_id',
    hidden: true,
  },
  {
    key: 'municipality_id',
    hidden: true,
  },
  {
    key: 'barangay_id',
    hidden: true,
  },
  {
    key: 'gravidity',
    hidden: true,
  },
  {
    key: 'parity',
    hidden: true,
  },
  {
    key: 'abortion',
    hidden: true,
  },
  {
    key: 'lmp',
    hidden: true,
  },
  {
    key: 'edc',
    hidden: true,
  },
  {
    key: 'outcome_sex',
    hidden: true,
  },
  {
    key: 'outcome_weight',
    hidden: true,
  },
  {
    key: 'place_of_delivery',
    hidden: true,
  },
  {
    key: 'date_delivery',
    hidden: true,
  },
  {
    key: 'bemoc_address',
    hidden: true,
  },
  {
    key: 'cemoc_address',
    hidden: true,
  },
  {
    key: 'barangay_worker_name',
    hidden: true,
  },
  {
    key: 'midwife_name',
    hidden: true,
  },
  {
    key: 'doctor_name',
    hidden: true,
  },
  {
    key: 'referral_unit',
    hidden: true,
  },
  {
    key: 'patient_address',
    hidden: true,
  },
  {
    key: 'center_province',
    hidden: true,
  },
  {
    key: 'center_municipality',
    hidden: true,
  },
  {
    key: 'center_barangay',
    hidden: true,
  },
  {
    key: 'barangay_name',
    hidden: true,
  },
  {
    key: 'municipality_name',
    hidden: true,
  },
  {
    key: 'province_name',
    hidden: true,
  },
  {
    key: 'region_name',
    hidden: true,
  },
  {
    key: 'attended_by',
    hidden: true,
  },
  {
    key: 'phic',
    hidden: true,
  },
  {
    key: 'anc_given',
    hidden: true,
  },
  {
    key: 'risk_codes',
    hidden: true,
  },
];

export const barangay_center_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: true,
    width: 'w-[20%]',
  },
  {
    key: 'rural_health_unit',
    title: 'Rural Health Unit',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[25%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'region',
    hidden: true,
  },
  {
    key: 'province',
    hidden: true,
  },
  {
    key: 'municipality',
    hidden: true,
  },
  {
    key: 'barangay',
    hidden: true,
  },
];

export const barangay_worker_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[30%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const nurse_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[30%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const midwife_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[30%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const user_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  { key: 'name', title: 'Name', sortable: true, width: 'w-[25%]' },
  { key: 'email', title: 'Email', sortable: true, width: 'w-[25%]' },
  {
    key: 'role',
    title: 'Role',
    sortable: false,
    width: 'w-[15%]',
    render: (value, row, index) => {
      return <span className='capitalize'>{value.role}</span>;
    },
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'role_id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const prenatal_visit_column = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[5%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    width: 'w-[5%]',
  },
  {
    key: 'date',
    title: 'Date',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'weight',
    title: 'Weight',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'bp',
    title: 'B/P',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'temp',
    title: 'Temp',
    sortable: false,
    width: 'w-[5%]',
  },

  {
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },

  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'firstname',
    hidden: true,
  },
  {
    key: 'lastname',
    hidden: true,
  },
  {
    key: 'middlename',
    hidden: true,
  },
  {
    key: 'birth_date',
    hidden: true,
  },
  {
    key: 'contact',
    hidden: true,
  },
  {
    key: 'contact_person_name',
    hidden: true,
  },
  {
    key: 'contact_person_number',
    hidden: true,
  },
  {
    key: 'contact_person_relationship',
    hidden: true,
  },
  {
    key: 'pregnancy_tracking_id',
    hidden: true,
  },
  {
    key: 'province',
    hidden: true,
  },
  {
    key: 'municipality',
    hidden: true,
  },
  {
    key: 'barangay',
    hidden: true,
  },
  {
    key: 'zone',
    hidden: true,
  },
  {
    key: 'rr',
    hidden: true,
  },
  {
    key: 'pr',
    hidden: true,
  },
  {
    key: 'two_sat',
    hidden: true,
  },
  {
    key: 'fht',
    hidden: true,
  },
  {
    key: 'fh',
    hidden: true,
  },
  {
    key: 'aog',
    hidden: true,
  },
  {
    key: 'lmp',
    hidden: true,
  },
  {
    key: 'edc',
    hidden: true,
  },
  {
    key: 'term',
    hidden: true,
  },
  {
    key: 'preterm',
    hidden: true,
  },
  {
    key: 'post_term',
    hidden: true,
  },
  {
    key: 'living_children',
    hidden: true,
  },
  {
    key: 'attended_by',
    hidden: true,
  },
];

export const out_patient_column = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[5%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    width: 'w-[5%]',
  },
  {
    key: 'date',
    title: 'Date',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'time',
    title: 'Time',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => {
      function formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
        });
      }
      return <span>{formatTime(value)}</span>;
    },
  },
  {
    key: 'height',
    title: 'Height',
    sortable: false,
    width: 'w-[5%]',
    render: (value) => {
      return <span>{value} cm</span>;
    },
  },
  {
    key: 'weight',
    title: 'Weight',
    sortable: false,
    width: 'w-[5%]',
    render: (value) => {
      return <span>{value} kg</span>;
    },
  },
  {
    key: 'bp',
    title: 'B/P',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'temp',
    title: 'Temp',
    sortable: false,
    width: 'w-[5%]',
  },

  {
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[15%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'firstname',
    hidden: true,
  },
  {
    key: 'lastname',
    hidden: true,
  },
  {
    key: 'middlename',
    hidden: true,
  },
  {
    key: 'birth_date',
    hidden: true,
  },
  {
    key: 'birth_place',
    hidden: true,
  },
  {
    key: 'contact',
    hidden: true,
  },
  {
    key: 'contact_person_name',
    hidden: true,
  },
  {
    key: 'contact_person_number',
    hidden: true,
  },
  {
    key: 'contact_person_relationship',
    hidden: true,
  },
  {
    key: 'pregnancy_tracking_id',
    hidden: true,
  },
  {
    key: 'zone',
    hidden: true,
  },
  {
    key: 'sex',
    hidden: true,
  },
  {
    key: 'full_address',
    hidden: true,
  },

  {
    key: 'rr',
    hidden: true,
  },
  {
    key: 'pr',
    hidden: true,
  },
  {
    key: 'two_sat',
    hidden: true,
  },
  {
    key: 'status',
    hidden: true,
  },
  {
    key: 'attending_physician',
    hidden: true,
  },
  {
    key: 'phic',
    hidden: true,
  },
  {
    key: 'religion',
    hidden: true,
  },
];

export const immunization_records_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[5%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    width: 'w-[5%]',
  },
  {
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'tetanus_last_vaccine',
    title: 'Tetanus',
    sortable: false,
    width: 'w-[10%]',
  },
  {
    key: 'covid_last_vaccine',
    title: 'Covid',
    sortable: false,
    width: 'w-[10%]',
  },
  {
    key: 'other_last_vaccine',
    title: 'Other',
    sortable: false,
    width: 'w-[10%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'pregnancy_tracking_id',
    hidden: true,
  },
  {
    key: 'tetanus_vaccine_id',
    hidden: true,
  },
  {
    key: 'covid_vaccine_id',
    hidden: true,
  },
  {
    key: 'tetanus_first_given',
    hidden: true,
  },
  {
    key: 'tetanus_second_give',
    hidden: true,
  },
  {
    key: 'tetanus_third_given',
    hidden: true,
  },
  {
    key: 'tetanus_fourth_given',
    hidden: true,
  },
  {
    key: 'tetanus_fifth_given',
    hidden: true,
  },
  {
    key: 'covid_first_given',
    hidden: true,
  },
  {
    key: 'covid_second_given',
    hidden: true,
  },
  {
    key: 'covid_third_given',
    hidden: true,
  },
  {
    key: 'other_first_given',
    hidden: true,
  },
  {
    key: 'other_second_given',
    hidden: true,
  },
  {
    key: 'other_third_given',
    hidden: true,
  },
  {
    key: 'other_fourth_given',
    hidden: true,
  },
  {
    key: 'other_fifth_given',
    hidden: true,
  },
  {
    key: 'tetanus_first_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_second_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_third_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_fourth_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_fifth_comeback',
    hidden: true,
  },
  {
    key: 'covid_first_give',
    hidden: true,
  },
  {
    key: 'covid_second_comeback',
    hidden: true,
  },
  {
    key: 'covid_third_comeback',
    hidden: true,
  },
  {
    key: 'other_first_comeback',
    hidden: true,
  },
  {
    key: 'other_second_comeback',
    hidden: true,
  },
  {
    key: 'other_third_comeback',
    hidden: true,
  },
  {
    key: 'other_fourth_comeback',
    hidden: true,
  },
  {
    key: 'other_fifth_comeback',
    hidden: true,
  },
];

export const appointment_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Fullname',
    sortable: true,
    width: 'w-[12%]',
  },
  {
    key: 'contact',
    title: 'Contact',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      if (!value) return '';
      if (value.startsWith('63')) {
        return '0' + value.slice(2);
      }
      return value;
    },
  },
  {
    key: 'appointment_date',
    title: 'Date',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      return new Date(value).toLocaleDateString('en-US', {
        month: 'short', // "Oct"
        day: '2-digit', // "01"
        year: 'numeric', // "2025"
      });
    },
  },

  {
    key: 'priority',
    title: 'Priority',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      let colorClass = '';
      switch (value) {
        case 'high':
          colorClass = 'bg-red-100 text-red-800';
          break;
        case 'medium':
          colorClass = 'bg-yellow-100 text-yellow-800';
          break;
        case 'low':
          colorClass = 'bg-green-100 text-green-800';
          break;
        default:
          colorClass = 'bg-gray-100 text-gray-800';
      }
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}
        >
          {value}
        </span>
      );
    },
  },
  {
    key: 'status',
    title: 'Status',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      let colorClass = '';
      switch (value) {
        case 'completed':
          colorClass = 'bg-green-100 text-green-800';
          break;
        case 'scheduled':
          colorClass = 'bg-blue-100 text-blue-800';
          break;
        case 'missed':
          colorClass = 'bg-red-100 text-red-800';
          break;
        default:
          colorClass = 'bg-gray-100 text-gray-800';
      }
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}
        >
          {value}
        </span>
      );
    },
  },
  {
    key: 'pregnancy_status',
    title: 'Pregnancy Status',
    sortable: false,
    width: 'w-[18%]',
    render: (value) => {
      let colorClass = '';
      let status = '';
      switch (value) {
        case 'completed':
          colorClass = 'bg-green-100 text-green-800';
          status = 'Completed';
          break;
        case 'first_trimester':
          colorClass = 'bg-blue-100 text-blue-800';
          status = '1st Trimester';
          break;
        case 'second_trimester':
          colorClass = 'bg-teal-100 text-teal-800';
          status = '2nd Trimester';
          break;
        case 'third_trimester':
          colorClass = 'bg-purple-100 text-purple-800';
          status = '3rd Trimester';
          break;
        case 'fourth_trimester':
          colorClass = 'bg-pink-100 text-pink-800';
          status = '4th Trimester';
          break;
        default:
          colorClass = 'bg-gray-100 text-gray-800';
      }
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'pregnancy_tracking_id',
    hidden: true,
  },
  {
    key: 'start_time',
    title: 'Start Time',
    hidden: true,
    sortable: false,
    width: 'w-[10%]',
    render: (value) =>
      new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
  {
    key: 'end_time',
    title: 'End Time',
    hidden: true,
    sortable: false,
    width: 'w-[10%]',
    render: (value) =>
      new Date(value).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
  {
    key: 'visit_count',
    hidden: true,
  },
  {
    key: 'notes',
    hidden: true,
  },
];

export const pickerOptions = {
  mode: 'single',
  dateFormat: 'Y-m-d',
  altInput: true,
};

export const pickerNoWeekendsOptions = {
  mode: 'single',
  altInput: true,
  altFormat: 'F j, Y',
  dateFormat: 'Y-m-d',
  disable: [
    (date) => date.getDay() === 0 || date.getDay() === 6, // disable weekends
  ],
};

export const pickerRangeOptions = {
  mode: 'range',
  altInput: true,
  altFormat: 'F j, Y',
  dateFormat: 'Y-m-d',
};

export const doctor_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[25%]',
  },
  {
    key: 'assigned_day',
    title: 'Assigned Day',
    sortable: false,
    width: 'w-[25%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[20%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
];

export const activity_log_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[5%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'user',
    title: 'User',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => {
      if (!value) return <span className='text-gray-400 italic'>System</span>;
      return <span>{value.name}</span>;
    },
  },
  {
    key: 'title',
    title: 'Title',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'info',
    title: 'Info',
    sortable: false,
    width: 'w-[30%]',
    render: (value) => <InfoCell value={value} />,
  },
  {
    key: 'loggable',
    title: 'Loggable',
    sortable: false,
    width: 'w-[20%]',
    render: (value) =>
      value ? (
        <span>
          {value.type} #{value.id}
        </span>
      ) : (
        <span className='text-gray-400 italic'>N/A</span>
      ),
  },
  {
    key: 'action',
    title: 'Action',
    sortable: false,
    width: 'w-[10%]',
    render: (value) => {
      return <span className='capitalize'>{value}</span>;
    },
  },
  {
    key: 'ip_address',
    title: 'IP Address',
    sortable: false,
    width: 'w-[8%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[7%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
];
