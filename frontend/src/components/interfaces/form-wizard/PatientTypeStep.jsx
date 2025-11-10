import { User, UserCheck } from 'lucide-react';
import SelectReact from '../../ui/SelectReact';
import NewPatientBasicInfo from './NewPatientBasicInfo';
import api from '../../../api/axios';

const PatientTypeCard = ({
  type,
  title,
  description,
  icon,
  patientType,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-6 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
      patientType === type
        ? 'border-purple-500 bg-purple-50'
        : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
  >
    <div className='flex items-center space-x-4'>
      <div
        className={`p-3 rounded-full ${
          patientType === type
            ? 'bg-purple-500 text-white'
            : 'bg-gray-100 text-gray-600'
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className='font-medium text-gray-900'>{title}</h3>
        <p className='text-sm text-gray-500'>{description}</p>
      </div>
    </div>
  </div>
);

const PatientTypeStep = ({
  patientType,
  setPatientType,
  formData,
  setFormData,
  inputChange,
  isEdit,
  error,
}) => {
  const onClick = (value) => {
    setPatientType(value);
    setFormData((prev) => ({ ...prev, patient_type: value }));
  };

  const handle_birth_date = (value, gravidity) => {
    // Calculate age
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setFormData((prev) => {
      let updatedRiskCodes = [...(prev.risk_codes || [])];

      // Remove A or B if previously added
      updatedRiskCodes = updatedRiskCodes.filter(
        (r) => r.risk_code !== 'A' && r.risk_code !== 'B'
      );

      // Add A or B depending on age
      if (age < 18) {
        updatedRiskCodes.push({
          risk_code: 'A',
          date_detected: '',
          risk_status: '',
          auto: true,
        });
      } else if (age > 35) {
        updatedRiskCodes.push({
          risk_code: 'B',
          date_detected: '',
          risk_status: '',
          auto: true,
        });
      }

      if (gravidity > 3) {
        updatedRiskCodes.push({
          risk_code: 'D',
          date_detected: '',
          risk_status: '',
          auto: true,
        });
      }

      return {
        ...prev,
        birth_date: value,
        risk_codes: updatedRiskCodes,
      };
    });
  };

  const handle_existing_patient = async (id) => {
    const params = {
      patient_id: id,
    };

    const res = await api.get('/api/filter/existing-patient', { params });

    const data = res.data.data || res.data;

    if (data) {
      setFormData((prev) => ({
        ...prev,
        gravidity: Number(data.gravidity) + 1,
        parity: data.parity,
        abortion: data.abortion,
        birth_date: data.birth_date,
        record_status: data.pregnancy_status,
        barangay_center_id: data.barangay_center_id,
        barangay_health_station: data.barangay_health_station,
      }));

      handle_birth_date(data.birth_date, data.gravidity);
    }
  };

  const handle_change = (value) => {
    setFormData((prev) => ({
      ...prev,
      patient_id: value,
    }));

    if (value) {
      handle_existing_patient(value);
    }
  };
  return (
    <div className='space-y-6'>
      {!isEdit && (
        <div>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            Choose Patient Type
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <PatientTypeCard
              type='existing'
              title='Existing Patient'
              description='Select from registered patients'
              icon={<UserCheck className='h-6 w-6' />}
              patientType={patientType}
              onClick={() => onClick('existing')}
            />
            <PatientTypeCard
              type='new'
              title='New Patient'
              description='Register a new patient'
              icon={<User className='h-6 w-6' />}
              patientType={patientType}
              onClick={() => onClick('new')}
            />
          </div>
        </div>
      )}

      {patientType === 'existing' && (
        <div className='mt-6'>
          <SelectReact
            label='Select Patient'
            id='patient_id'
            name='patient_id'
            endpoint='/api/patients'
            placeholder='Choose a patient'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) => handle_change(value)}
            labelKey='fullname'
          />
          {error.patient_id && (
            <p className='error mt-1'>{error.patient_id[0]}</p>
          )}
        </div>
      )}

      {(patientType === 'new' || patientType === 'edit') && (
        <NewPatientBasicInfo
          formData={formData}
          inputChange={inputChange}
          error={error}
          setFormData={setFormData}
        />
      )}
    </div>
  );
};

export default PatientTypeStep;
