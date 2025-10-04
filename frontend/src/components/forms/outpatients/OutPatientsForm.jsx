import {
  Activity,
  Droplet,
  HeartPulse,
  Ruler,
  Thermometer,
  Weight,
  Wind,
} from 'lucide-react';
import SelectReact from '../../ui/SelectReact';
import InputGroup from '../../ui/InputGroup';
import DatePicker from '../../ui/DatePicker';
import api from '../../../api/axios';

const OutPatientsForm = ({
  onSubmit,
  inputChange,
  formData,
  setFormData,
  error,
  isSubmitting,
  isEdit,
}) => {
  const handleChange = async (value) => {
    if (value) {
      try {
        const res = await api.get(`/api/prenatal-visits/${value}`);

        const data = res.data.data || res.data;

        if (data) {
          setFormData((prev) => ({
            ...prev,
            pregnancy_tracking_id: value,
            weight: data.weight,
            bp: data.bp,
            temp: data.temp,
            rr: data.rr,
            pr: data.pr,
            two_sat: data.two_sat,
          }));
        }
      } catch (error) {
        console.log('Error ', error);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        pregnancy_tracking_id: value,
        weight: '',
        bp: '',
        temp: '',
        rr: '',
        pr: '',
        two_sat: '',
      }));
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className='flex flex-col md:flex-row gap-4 bg-gray-50 rounded-lg space-y-6 sm:w-auto mb-2'>
        {/* Visit Date */}
        <div className='w-full  p-4 rounded-lg space-y-2 '>
          <div>
            <SelectReact
              label='Select Patient'
              id='pregnancy_tracking_id'
              name='pregnancy_tracking_id'
              endpoint={`/api/filter/pregnancy-trakings/has-appointments`}
              placeholder='Choose a patient'
              value={formData.pregnancy_tracking_id}
              formData={formData}
              onChange={(value) => handleChange(value)}
              labelKey='fullname'
            />
            {error.pregnancy_tracking_id && (
              <p className='error mt-1'>{error.pregnancy_tracking_id[0]}</p>
            )}
          </div>

          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='flex-1'>
              <DatePicker
                disable_weekends
                hasLabel
                label='Select Date'
                value={formData.date}
                setFormData={setFormData}
                id='date'
                name='date'
              />
              {error.date && <p className='error mt-1'>{error.date[0]}</p>}
            </div>

            <div className='flex-1'>
              <DatePicker
                hasLabel
                label='Select Time'
                placeholder='Select Time'
                value={formData.time}
                setFormData={setFormData}
                id='time'
                name='time'
                dateFormat='H:i'
                disable_weekends
                enableTime
                noCalendar
              />
              {error.time && <p className='error mt-1'>{error.time[0]}</p>}
            </div>
          </div>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <div className='flex-1'>
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
            </div>

            <div className='flex-1'>
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
              />
              {error.weight && <p className='error mt-1'>{error.weight[0]}</p>}
            </div>
          </div>
        </div>

        {/* Vital Signs Section */}
        <div className='bg-gray-50 p-4 rounded-lg w-full mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            Vital Signs
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='-mt-5 col-span-1 sm:col-span-2'>
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
            </div>

            <div className='-mt-5'>
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
              />
              {error.temp && <p className='error mt-1'>{error.temp[0]}</p>}
            </div>

            <div className='-mt-5'>
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
              />
              {error.rr && <p className='error mt-1'>{error.rr[0]}</p>}
            </div>

            <div className='-mt-5'>
              <InputGroup
                type='number'
                name='pr'
                id='pr'
                value={formData.pr}
                onChange={inputChange}
                placeholder='80'
                icon={<HeartPulse className='h-5 w-5 text-gray-400' />}
                hasLabel
                label='Pulse Rate (bpm)'
              />
              {error.pr && <p className='error mt-1'>{error.pr[0]}</p>}
            </div>

            <div className='-mt-5'>
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
              {error.two_sat && (
                <p className='error mt-1'>{error.two_sat[0]}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        disabled={isSubmitting}
        className={`w-full bg-gradient-to-r text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg 
              ${
                isSubmitting
                  ? 'from-purple-300 to-pink-300 cursor-not-allowed'
                  : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }`}
      >
        {isSubmitting
          ? isEdit
            ? 'Updating ...'
            : 'Creating ...'
          : isEdit
          ? 'Update Out Patient'
          : 'Create Out Patient'}
      </button>
    </form>
  );
};

export default OutPatientsForm;
