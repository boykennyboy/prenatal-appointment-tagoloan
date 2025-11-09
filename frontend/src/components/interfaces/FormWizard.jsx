import { useEffect, useRef, useState } from 'react';
import { useFormSubmit } from '../../utils/functions';
import PatientTypeStep from './form-wizard/PatientTypeStep';
import PersonalDetailsStep from './form-wizard/PesronalDetailsStep';
import HealthInformationStep from './form-wizard/HealthInformationStep';
import PregnancyReviewInterface from './form-wizard/PregnancyTrackingReviewIternface';
import StepIndicator from './form-wizard/StepIndicator';
import NavigationButtons from './form-wizard/NavigationButtons';
import {
  pregnancyEditFormData,
  pregnancyFormData,
} from '../../utils/formDefault.jsx';
import { useAuthStore } from '../../store/authStore.js';
import RiskCodes from './form-wizard/RiskCodes.jsx';

const FormWizard = ({ row = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientType, setPatientType] = useState('');
  const [pregnancyTrackingId, setPregnancyTrackingId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const printRef = useRef();
  const { user } = useAuthStore();

  const [pregnancyTrackingData, setPregnancyTrackingData] = useState(null);
  const [savedFormData, setSavedFormData] = useState({});

  // Without Value FormData
  const [formData, setFormData] = useState(pregnancyFormData);

  // With Value FormData for testing
  // const [formData, setFormData] = useState({
  //   age: '',
  //   barangay: '',
  //   barangay_center_id: '',
  //   barangay_health_station: '',
  //   nurse_id: '',
  //   birth_date: '2002-08-06',
  //   birth_place: 'Tagoloan Misamis Oriental',
  //   bemoc: 'St. Paul Hospital',
  //   bemoc_address: 'Poblacion Tagoloan Misamis Oriental',
  //   contact: '639637475332',
  //   contact_person_name: 'Mae  A. Pragas',
  //   contact_person_number: '639871233542',
  //   contact_person_relationship: 'Sister',
  //   edc: '2026-04-14',
  //   firstname: 'Laila',
  //   gravidity: '2',
  //   lastname: 'Pragas',
  //   lmp: '2025-06-08',
  //   middlename: 'Ando',
  //   midwife_id: '',
  //   municipality: 1248,
  //   parity: '1',
  //   patient_id: '',
  //   patient_type: 'new',
  //   province: 57,
  //   cemoc: 'St. Paul Hospital',
  //   cemoc_address: 'Poblacion Tagoloan Misamis Oriental',
  //   region: 13,
  //   religion: 'Roman Catholic',
  //   referral_unit: 'St. Paul Hospital',
  //   sex: 'female',
  //   status: 'single',
  //   zone: 'Zone 4',
  //   barangay_name: '',
  //   nurse_name: '',
  //   midwife_name: '',
  //   municipality_name: '',
  //   province_name: '',
  //   region_name: '',
  //   abortion: 0,
  //   risk_codes: [
  //     { risk_code: '', date_detected: '', risk_status: '', auto: false },
  //   ],
  //   record_status: '',
  // });

  const { handleSubmit, isSubmitting, error, setError, data } = useFormSubmit();

  const steps = [
    {
      number: 1,
      title: 'Patient Information',
      description: 'Basic patient details',
    },
    {
      number: 2,
      title: 'Personal Details',
      description: 'Contact and address information',
    },
    {
      number: 3,
      title: 'Health Information',
      description: 'Medical and tracking details',
    },
    {
      number: 4,
      title: 'Risk Codes',
      description: 'List one or more pregnancy-related risk codes',
    },
    {
      number: 5,
      title: 'Review & Submit',
      description: 'Please review all information before submitting',
    },
  ];

  const handleNewRecord = () => {
    if (isEdit) {
      setIsEdit(false);
      setPregnancyTrackingId(0);
    }
    setCurrentStep(1);
    setIsSubmitted(false);
    setPregnancyTrackingData(null);
    setSavedFormData({});
    setFormData(pregnancyFormData);
  };

  const showToastError = true;

  const onSubmit = (e) => {
    setSavedFormData(formData);
    handleSubmit({
      e,
      showToastError,
      isEdit,
      url: isEdit
        ? `/api/pregnancy-trackings/${pregnancyTrackingId}`
        : '/api/pregnancy-trackings',
      formData,
      onSuccess: (record) => {
        setIsSubmitted(true);
        setPregnancyTrackingData(record);
      },
      onReset: () => {
        setFormData(pregnancyFormData);
        setError({});
        if (isEdit) {
          setPregnancyTrackingId(0);
          setIsEdit(false);
        }
      },
    });
  };

  useEffect(() => {
    if (row) {
      setIsEdit(true);
      setPatientType('edit');
      setPregnancyTrackingId(row.id);
      setFormData(pregnancyEditFormData(row));
      setSavedFormData(pregnancyEditFormData(row));
    }
  }, [row]);

  useEffect(() => {
    setError({});
    if (user.role_id === 2) {
      setFormData((prev) => ({
        ...prev,
        barangay: user.barangay_center.barangay,
        barangay_center_id: user.barangay_center_id,
        barangay_health_station: user.barangay_center.health_station,
      }));
    }
  }, [user]);

  const inputChange = (e, phoneNumber = null) => {
    const { name, value } = e.target;

    if (phoneNumber) {
      setFormData((prev) => ({ ...prev, [name]: phoneNumber }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientTypeStep
            patientType={patientType}
            setPatientType={setPatientType}
            formData={formData}
            isEdit={isEdit}
            setFormData={setFormData}
            inputChange={inputChange}
            error={error}
          />
        );
      case 2:
        return (
          <PersonalDetailsStep
            patientType={patientType}
            formData={formData}
            setFormData={setFormData}
            inputChange={inputChange}
            error={error}
          />
        );
      case 3:
        return (
          <HealthInformationStep
            formData={formData}
            setFormData={setFormData}
            inputChange={inputChange}
            error={error}
          />
        );
      case 4:
        return (
          <RiskCodes
            formData={formData}
            setFormData={setFormData}
            error={error}
          />
        );
      case 5:
        return (
          <PregnancyReviewInterface
            pregnancyTrackingData={pregnancyTrackingData}
            formData={formData}
            isSubmitted={isSubmitted}
            patientType={patientType}
            savedFormData={savedFormData}
            handleNewRecord={handleNewRecord}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full mx-auto sm:p-4'>
      <div className='sticky top-26 z-10 bg-white py-0.5 border-b-1 rounded-lg border-gray-200 -mx-4 px-4 sm:mx-0 sm:px-0'>
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          error={error}
          formData={formData}
        />
      </div>

      <div className='bg-white border border-gray-200 rounded-lg p-6 mb-6'>
        {renderStepContent()}
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        patientType={patientType}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        onPrevious={prevStep}
        isEdit={isEdit}
        onNext={nextStep}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default FormWizard;
