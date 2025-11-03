import React, { useState } from 'react';
import {
  Activity,
  Baby,
  CalendarDays,
  Droplet,
  Heart,
  HeartPlus,
  HeartPulse,
  Ruler,
  Thermometer,
  Weight,
  Wind,
  ChevronLeft,
  ChevronRight,
  Syringe,
  AlertCircle,
  CheckCircle,
  X,
} from 'lucide-react';
import api from '../../../api/axios';
import SelectReact from '../../ui/SelectReact';
import { useFormSubmit } from '../../../utils/functions';
import DatePicker from '../../ui/DatePicker';
import InputGroup from '../../ui/InputGroup';
import { pickerNoWeekendsOptions } from '../../../utils/columns';
import { prenatal_outpatient_immunization_form_data } from '../../../utils/formDefault';

// ✅ Move ImmunizationStep OUTSIDE the main component
const ImmunizationStep = ({
  formData = {},
  handleInputChange = () => {},
  error = {},
  isEdit = false,
  initialFormData = {},
}) => {
  const [activeTab, setActiveTab] = useState('tetanus');

  const tabs = [
    { id: 'tetanus', label: 'Tetanus Vaccine', icon: '💉' },
    { id: 'covid', label: 'COVID-19 Vaccine', icon: '🦠' },
    { id: 'other', label: 'Other Vaccines', icon: '🏥' },
  ];

  const doses = ['first', 'second', 'third', 'fourth', 'fifth'];

  // Helper component to show previous value
  const PreviousValue = ({ fieldName }) => {
    if (
      !isEdit ||
      !initialFormData[fieldName] ||
      initialFormData[fieldName] === formData[fieldName]
    ) {
      return null;
    }
    return (
      <div className='flex items-center gap-1 mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded'>
        <AlertCircle className='h-3 w-3' />
        <span>Previous: {initialFormData[fieldName]}</span>
      </div>
    );
  };

  // Helper to render a section for any vaccine
  const VaccineSection = ({ vaccine, doseList }) => (
    <div className='space-y-6'>
      {/* Given Dates */}
      <div>
        <h4 className='text-md font-semibold text-gray-700 mb-3'>
          Given Dates
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {doseList.map((dose, index) => {
            const labelSuffix = ['st', 'nd', 'rd'][index] || 'th';
            const fieldName = `${vaccine}_${dose}_given`;
            return (
              <div key={`given-${dose}`}>
                <DatePicker
                  options={pickerNoWeekendsOptions}
                  label={`${index + 1}${labelSuffix} Dose Given`}
                  name={fieldName}
                  id={fieldName}
                  value={formData?.[fieldName] || ''}
                  onChange={handleInputChange}
                  hasLabel
                />
                {error?.[fieldName] && (
                  <p className='error mt-1'>{error[fieldName][0]}</p>
                )}
                <PreviousValue fieldName={fieldName} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Comeback Dates */}
      <div>
        <h4 className='text-md font-semibold text-gray-700 mb-3'>
          Comeback Dates
        </h4>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
          {doseList.map((dose, index) => {
            const labelSuffix = ['st', 'nd', 'rd'][index] || 'th';
            const fieldName = `${vaccine}_${dose}_comeback`;
            return (
              <div key={`comeback-${dose}`}>
                <DatePicker
                  options={pickerNoWeekendsOptions}
                  label={`${index + 1}${labelSuffix} Dose Comeback`}
                  name={fieldName}
                  id={fieldName}
                  value={formData?.[fieldName] || ''}
                  onChange={handleInputChange}
                  hasLabel
                />
                {error?.[fieldName] && (
                  <p className='error mt-1'>{error[fieldName][0]}</p>
                )}
                <PreviousValue fieldName={fieldName} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const TetanusForm = () => (
    <VaccineSection vaccine='tetanus' doseList={doses} />
  );

  const CovidForm = () => (
    <VaccineSection vaccine='covid' doseList={['first', 'second', 'booster']} />
  );

  const OtherForm = () => (
    <div className='space-y-6'>
      <div>
        <InputGroup
          label='Vaccine Name'
          name='other_vaccine_name'
          value={formData?.other_vaccine_name || ''}
          placeholder='Enter vaccine name'
          id='other_vaccine_name'
          onChange={handleInputChange}
          icon={<Syringe className='h-5 w-5 text-gray-400' />}
          hasLabel
        />
        {error?.other_vaccine_name && (
          <p className='error mt-1'>{error.other_vaccine_name[0]}</p>
        )}
        <PreviousValue fieldName='other_vaccine_name' />
      </div>

      <VaccineSection vaccine='other' doseList={doses} />
    </div>
  );

  return (
    <div className='space-y-4'>
      {/* Tabs Navigation */}
      <div className='border-b border-gray-200'>
        <nav className='flex gap-4'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type='button'
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.icon}</span>
              <span className='hidden sm:inline'>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='bg-white border border-gray-200 rounded-lg p-4'>
        {activeTab === 'tetanus' && <TetanusForm />}
        {activeTab === 'covid' && <CovidForm />}
        {activeTab === 'other' && <OtherForm />}
      </div>
    </div>
  );
};

// ✅ Move PrenatalVisitStep OUTSIDE as well
const PrenatalVisitStep = ({
  formData,
  error,
  inputChange,
  handleChange,
  handle_change,
  handleDateChange,
  isEdit,
  initialFormData = {},
  setFormData,
}) => {
  // Helper component to show previous value
  const PreviousValue = ({ fieldName }) => {
    if (
      !isEdit ||
      !initialFormData[fieldName] ||
      initialFormData[fieldName] === formData[fieldName]
    ) {
      return null;
    }
    return (
      <div className='flex items-center gap-1 mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded'>
        <AlertCircle className='h-3 w-3' />
        <span>Previous: {initialFormData[fieldName]}</span>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='md:col-span-2'>
          <SelectReact
            label='Select Patient'
            id='pregnancy_tracking_id'
            name='pregnancy_tracking_id'
            endpoint={`/api/filter/pregnancy-trakings/has-appointments${
              isEdit ? '?isEdit=true' : ''
            }`}
            placeholder='Choose a patient'
            value={formData.pregnancy_tracking_id}
            formData={formData}
            onChange={(value) => {
              if (!isEdit) handleChange(value); // only allow change if NOT editing
            }}
            labelKey='fullname'
            isClearable={!isEdit}
            isMenuOpen={isEdit ? false : undefined} // keep menu closed if editing
            isSearchable={!isEdit}
          />
          {error.pregnancy_tracking_id && (
            <p className='error mt-1'>{error.pregnancy_tracking_id[0]}</p>
          )}
        </div>

        <div>
          <DatePicker
            disable_weekends
            hasLabel
            label='Visit Date'
            value={formData.date}
            onChange={handleDateChange}
            id='date'
            name='date'
          />
          {error.date && <p className='error mt-1'>{error.date[0]}</p>}
          <PreviousValue fieldName='date' />
        </div>

        <div>
          <DatePicker
            hasLabel
            label='Select Time'
            placeholder='Select Time'
            value={formData.time}
            setFormData={setFormData}
            id='time'
            name='time'
            dateFormat='H:i'
            enableTime
            noCalendar
          />
          {error.time && <p className='error mt-1'>{error.time[0]}</p>}
          <PreviousValue fieldName='time' />
        </div>

        <div>
          <InputGroup
            type='number'
            name='height'
            id='height'
            value={formData.height}
            onChange={inputChange}
            placeholder='Enter height'
            icon={<Ruler className='h-5 w-5 text-gray-400' />}
            hasLabel
            label='height (cm)'
          />
          {error.height && <p className='error mt-1'>{error.height[0]}</p>}
          <PreviousValue fieldName='height' />
        </div>

        <div>
          <InputGroup
            type='number'
            step='0.1'
            name='weight'
            id='weight'
            value={formData.weight}
            onChange={inputChange}
            placeholder='Enter weight'
            icon={<Weight className='h-5 w-5 text-gray-400' />}
            hasLabel
            label='Weight (kg)'
            min={0}
          />
          {error.weight && <p className='error mt-1'>{error.weight[0]}</p>}
          <PreviousValue fieldName='weight' />
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Fetal Assessment
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <InputGroup
              type='text'
              name='fht'
              id='fht'
              value={formData.fht}
              onChange={inputChange}
              placeholder='Normal'
              icon={<Baby className='h-5 w-5 text-gray-400' />}
              hasLabel
              disabled
              label='Fetal Heart Tone (FHT)'
            />
            {error.fht && <p className='error mt-1'>{error.fht[0]}</p>}
            <PreviousValue fieldName='fht' />
          </div>

          <div>
            <InputGroup
              type='number'
              step='0.1'
              name='fh'
              id='fh'
              value={formData.fh}
              onChange={inputChange}
              placeholder='24'
              icon={<Ruler className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Fundal Height (FH) cm'
              min={0}
            />
            {error.fh && <p className='error mt-1'>{error.fh[0]}</p>}
            <PreviousValue fieldName='fh' />
          </div>

          <div>
            <InputGroup
              type='text'
              name='aog'
              id='aog'
              value={formData.aog}
              onChange={inputChange}
              placeholder='15/4'
              icon={<CalendarDays className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Age of Gestation (AOG) weeks/days'
              disabled
            />
            {error.aog && <p className='error mt-1'>{error.aog[0]}</p>}
            <PreviousValue fieldName='aog' />
          </div>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Vital Signs
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='md:col-span-2'>
            <InputGroup
              type='text'
              name='bp'
              id='bp'
              value={formData.bp}
              onChange={inputChange}
              placeholder='120/80'
              icon={<Activity className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Blood Pressure (mmHg)'
            />
            {error.bp && <p className='error mt-1'>{error.bp[0]}</p>}
            <PreviousValue fieldName='bp' />
          </div>

          <div>
            <InputGroup
              type='number'
              step='0.1'
              name='temp'
              id='temp'
              value={formData.temp}
              onChange={inputChange}
              placeholder='36.5'
              icon={<Thermometer className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Temperature (°C)'
              min={0}
            />
            {error.temp && <p className='error mt-1'>{error.temp[0]}</p>}
            <PreviousValue fieldName='temp' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='rr'
              id='rr'
              value={formData.rr}
              onChange={inputChange}
              placeholder='16'
              icon={<Wind className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Respiratory Rate (breaths/min)'
              min={0}
            />
            {error.rr && <p className='error mt-1'>{error.rr[0]}</p>}
            <PreviousValue fieldName='rr' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='pr'
              id='pr'
              value={formData.pr}
              onChange={handle_change}
              placeholder='110'
              icon={<HeartPulse className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Pulse Rate (bpm)'
              min={0}
            />
            {error.pr && <p className='error mt-1'>{error.pr[0]}</p>}
            <PreviousValue fieldName='pr' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='two_sat'
              id='two_sat'
              value={formData.two_sat}
              onChange={inputChange}
              min='0'
              max='100'
              placeholder='98'
              icon={<Droplet className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='O2 Saturation (%)'
            />
            {error.two_sat && <p className='error mt-1'>{error.two_sat[0]}</p>}
            <PreviousValue fieldName='two_sat' />
          </div>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Pregnancy History
        </h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div>
            <InputGroup
              type='number'
              name='term'
              id='term'
              value={formData.term}
              onChange={inputChange}
              placeholder='3'
              icon={<HeartPlus className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Term'
              min={0}
            />
            {error.term && <p className='error mt-1'>{error.term[0]}</p>}
            <PreviousValue fieldName='term' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='preterm'
              id='preterm'
              value={formData.preterm}
              onChange={inputChange}
              placeholder='2'
              icon={<HeartPulse className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Preterm'
              min={0}
            />
            {error.preterm && <p className='error mt-1'>{error.preterm[0]}</p>}
            <PreviousValue fieldName='preterm' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='post_term'
              id='post_term'
              value={formData.post_term}
              onChange={inputChange}
              placeholder='2'
              icon={<Heart className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Post Term'
              min={0}
            />
            {error.post_term && (
              <p className='error mt-1'>{error.post_term[0]}</p>
            )}
            <PreviousValue fieldName='post_term' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='living_children'
              id='living_children'
              value={formData.living_children}
              onChange={inputChange}
              placeholder='4'
              icon={<Baby className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Living Children'
              min={0}
            />
            {error.living_children && (
              <p className='error mt-1'>{error.living_children[0]}</p>
            )}
            <PreviousValue fieldName='living_children' />
          </div>
        </div>
      </div>
    </div>
  );
};

const UnifiedForm = ({
  formData,
  setFormData,
  onSubmit,
  error,
  isSubmitting,
  isEdit,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showImmunization, setShowImmunization] = useState(false);
  // Store initial form data on first render when in edit mode
  const [initialFormData, setInitialFormData] = useState({});

  // Capture initial form data when component mounts or when isEdit becomes true
  React.useEffect(() => {
    if (isEdit && Object.keys(initialFormData).length === 0) {
      setInitialFormData({ ...formData });
    }
  }, [isEdit]);

  const steps = showImmunization
    ? [
        { id: 0, title: 'Prenatal Visit/Out Patient', icon: Baby },
        { id: 1, title: 'Immunization', icon: Syringe },
      ]
    : [{ id: 0, title: 'Prenatal Visit/Out Patient', icon: Baby }];

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle date changes from DatePicker
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = async (selected) => {
    if (selected) {
      try {
        const res = await api.get(`/api/out-patients/${selected}`);
        const data = res.data.data || res.data;

        if (data) {
          setFormData((prev) => ({
            ...prev,
            pregnancy_tracking_id: selected,
            aog: data.aog,
          }));

          if (data.pregnancy_status === 'third_trimester') {
            setShowImmunization(true);
          } else {
            setShowImmunization(false);
            if (currentStep === 1) setCurrentStep(0);
          }
        }
      } catch (error) {
        console.log('Error ', error);
      }
    } else {
      setShowImmunization(false);
      if (currentStep === 1) setCurrentStep(0);
    }
  };

  const handle_change = (e) => {
    const { name, value } = e.target;

    if (!value) {
      setFormData((prev) => ({
        ...prev,
        pr: value,
        fht: '',
      }));
    } else if (value < 110 || value > 160) {
      setFormData((prev) => ({
        ...prev,
        pr: value,
        fht: 'Abnormal',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        pr: value,
        fht: 'Normal',
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    onSubmit(e, showImmunization, setShowImmunization);
    setCurrentStep(0);
  };

  return (
    <div className='min-h-screen w-full'>
      <div className='w-full mx-auto'>
        <div className='bg-white'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>
            Prenatal Care Form
          </h1>
          <p className='text-gray-600'>
            Complete all sections for comprehensive patient care
          </p>
        </div>

        <div className='bg-white py-4'>
          <div className='flex items-center justify-between'>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.id}>
                  <div className='flex flex-col items-center flex-1'>
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentStep === index
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110 shadow-lg'
                          : currentStep > index
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {currentStep > index ? (
                        <CheckCircle className='h-6 w-6' />
                      ) : (
                        <Icon className='h-6 w-6' />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs sm:text-sm font-medium ${
                        currentStep === index
                          ? 'text-purple-600'
                          : currentStep > index
                          ? 'text-green-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                        currentStep > index ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className='bg-white p-6 min-h-[500px]'>
          <div className='mb-6'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
              {steps[currentStep].title}
            </h2>
            <div className='h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full'></div>
          </div>

          <div className='animate-fadeIn'>
            {currentStep === 0 && (
              <PrenatalVisitStep
                formData={formData}
                error={error}
                inputChange={inputChange}
                handleChange={handleChange}
                handle_change={handle_change}
                handleDateChange={handleDateChange}
                isEdit={isEdit}
                initialFormData={initialFormData}
                setFormData={setFormData}
              />
            )}
            {currentStep === 1 && (
              <ImmunizationStep
                formData={formData}
                handleInputChange={inputChange}
                error={error}
                isEdit={isEdit}
                initialFormData={initialFormData}
              />
            )}
          </div>
        </div>

        <div className='bg-white rounded-b-2xl p-6'>
          <div className='flex flex-col sm:flex-row gap-4'>
            <button
              type='button'
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105 shadow-md'
              }`}
            >
              <ChevronLeft className='h-5 w-5' />
              Previous
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type='button'
                onClick={handleNext}
                className='flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg'
              >
                Next
                <ChevronRight className='h-5 w-5' />
              </button>
            ) : (
              <button
                type='button'
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transform transition-all duration-200 shadow-lg ${
                  isSubmitting
                    ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <div className='flex items-center justify-center gap-2'>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  'Submit Form'
                )}
              </button>
            )}
          </div>

          <div className='mt-4'>
            <div className='flex justify-between text-sm text-gray-600 mb-1'>
              <span>Progress</span>
              <span>
                {Math.round(((currentStep + 1) / steps.length) * 100)}%
              </span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div
                className='bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-500'
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UnifiedForm;
