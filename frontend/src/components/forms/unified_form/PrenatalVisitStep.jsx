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
  AlertCircle,
} from 'lucide-react';
import SelectReact from '../../ui/SelectReact';
import DatePicker from '../../ui/DatePicker';
import InputGroup from '../../ui/InputGroup';

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
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
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
              disabled={!formData.pregnancy_tracking_id}
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
              disabled={!formData.pregnancy_tracking_id}
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
              disabled={!formData.pregnancy_tracking_id}
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
              disabled={!formData.pregnancy_tracking_id}
            />
            {error.living_children && (
              <p className='error mt-1'>{error.living_children[0]}</p>
            )}
            <PreviousValue fieldName='living_children' />
          </div>

          <div>
            <InputGroup
              type='number'
              name='gravidity'
              id='gravidity'
              value={formData.gravidity}
              onChange={inputChange}
              placeholder='5'
              icon={<Heart className='h-5 w-5 text-gray-400' />}
              hasLabel
              label='Gravidity'
              min={0}
              disabled
            />
            {error.gravidity && (
              <p className='error mt-1'>{error.gravidity[0]}</p>
            )}
          </div>
        </div>

        {/* Info note about validation */}
        {!formData.pregnancy_tracking_id && (
          <div className='mt-4 p-3 bg-blue-50 rounded-md border border-blue-200'>
            <p className='text-sm text-blue-800'>
              <strong>Note:</strong> Please select a patient first to enable
              typing in the pregnancy history fields.
            </p>
          </div>
        )}
        <div className='mt-4 p-3 bg-blue-50 rounded-md border border-blue-200'>
          <p className='text-sm text-blue-800'>
            <strong>Note:</strong> Term + Preterm + Post Term must not exceed
            Gravidity - 1. Living children cannot exceed Gravidity - 1. (Current
            pregnancy not included)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrenatalVisitStep;
