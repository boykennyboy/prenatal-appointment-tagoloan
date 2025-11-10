import React, { useState } from 'react';
import DateInput from '../../ui/DateInput';
import InputGroup from '../../ui/InputGroup';
import SelectReact from '../../ui/SelectReact';
import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  FileWarning,
  Syringe,
} from 'lucide-react';
import DatePicker from '../../ui/DatePicker';
import { pickerNoWeekendsOptions } from '../../../utils/columns';

const ImmunizationForm = ({
  inputChange,
  onSubmit,
  isEdit = false,
  isSubmitting = false,
  formData = {},
  setFormData,
  error,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('tetanus');

  // Helper function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (inputChange) {
      inputChange(e);
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'tetanus', label: 'Tetanus Vaccine', icon: '💉' },
    { id: 'covid', label: 'COVID-19 Vaccine', icon: '🦠' },
    { id: 'other', label: 'Other Vaccines', icon: '🏥' },
  ];

  // Tetanus Vaccine Form
  const TetanusForm = () => (
    <div className='grid grid-cols-1 gap-4'>
      <div className='space-y-2'>
        <h4 className='text-lg font-semibold text-gray-800 border-b pb-2'>
          Given Dates
        </h4>
        <div className='flex flex-col sm:flex-row items-center gap-2'>
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='1st Dose Given'
            name='tetanus_first_given'
            value={formData.tetanus_first_given}
            id='tetanus_first_given'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='2nd Dose Given'
            name='tetanus_second_given'
            value={formData.tetanus_second_given}
            id='tetanus_second_given'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='3rd Dose Given'
            name='tetanus_third_given'
            value={formData.tetanus_third_given}
            id='tetanus_third_given'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='4th Dose Given'
            name='tetanus_fourth_given'
            value={formData.tetanus_fourth_given}
            id='tetanus_fourth_given'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='5th Dose Given'
            name='tetanus_fifth_given'
            value={formData.tetanus_fifth_given}
            id='tetanus_fifth_given'
            onChange={handleInputChange}
            hasLabel
          />
        </div>
      </div>

      <div className='space-y-2'>
        <h4 className='text-lg font-semibold text-gray-800 border-b pb-2'>
          Comeback Dates
        </h4>
        <div className='flex flex-col sm:flex-row items-center gap-2'>
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='1st Date Comeback'
            name='tetanus_first_comeback'
            value={formData.tetanus_first_comeback}
            id='tetanus_first_comeback'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='2nd Date Comeback'
            name='tetanus_second_comeback'
            value={formData.tetanus_second_comeback}
            id='tetanus_second_comeback'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='3rd Date Comeback'
            name='tetanus_third_comeback'
            value={formData.tetanus_third_comeback}
            id='tetanus_third_comeback'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='4th Date Comeback'
            name='tetanus_fourth_comeback'
            value={formData.tetanus_fourth_comeback}
            id='tetanus_fourth_comeback'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='5th Date Comeback'
            name='tetanus_fifth_comeback'
            value={formData.tetanus_fifth_comeback}
            id='tetanus_fifth_comeback'
            onChange={handleInputChange}
            hasLabel
          />
        </div>
      </div>
    </div>
  );

  // COVID-19 Vaccine Form
  const CovidForm = () => (
    <div className='grid grid-cols-1 gap-4'>
      <div className='space-y-2'>
        <h4 className='text-lg font-semibold text-gray-800 border-b pb-2'>
          Given Dates
        </h4>
        <div className='flex flex-col sm:flex-row items-center gap-2'>
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='1st Dose Given'
            name='covid_first_given'
            value={formData.covid_first_given}
            id='covid_first_given'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='2nd Dose Given'
            name='covid_second_given'
            value={formData.covid_second_given}
            id='covid_second_given'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='Booster Given'
            name='covid_booster_given'
            value={formData.covid_booster_given}
            id='covid_booster_given'
            onChange={handleInputChange}
            hasLabel
          />
        </div>
      </div>

      <div className='space-y-2'>
        <h4 className='text-lg font-semibold text-gray-800 border-b pb-2'>
          Comeback Dates
        </h4>
        <div className='flex flex-col sm:flex-row items-center gap-2'>
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='1st Date Comeback'
            name='covid_first_comeback'
            value={formData.covid_first_comeback}
            id='covid_first_comeback'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='2nd Date Comeback'
            name='covid_second_comeback'
            value={formData.covid_second_comeback}
            id='covid_second_comeback'
            onChange={handleInputChange}
            hasLabel
          />
          <DatePicker
            options={pickerNoWeekendsOptions}
            label='Booster Date Comeback'
            name='covid_booster_comeback'
            value={formData.covid_booster_comeback}
            id='covid_booster_comeback'
            onChange={handleInputChange}
            hasLabel
          />
        </div>
      </div>
    </div>
  );

  // Other Vaccines Form
  const OtherForm = () => (
    <div className='space-y-4'>
      <div className='grid grid-cols-1 gap-4'>
        <InputGroup
          label='Vaccine Name'
          name='other_vaccine_name'
          value={formData.other_vaccine_name}
          placeholder='Enter vaccine name'
          id='other_vaccine_name'
          onChange={handleInputChange}
          icon={<Syringe className='h-5 w-5 text-gray-400' />}
          hasLabel
        />
      </div>

      <div className='grid grid-cols-1 gap-4'>
        <div className='space-y-2'>
          <h4 className='text-lg font-semibold text-gray-800 border-b pb-2'>
            Given Dates
          </h4>
          <div className='flex flex-col sm:flex-row items-center gap-2'>
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='1st Dose Given'
              name='other_first_given'
              value={formData.other_first_given}
              id='other_first_given'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='2nd Dose Given'
              name='other_second_given'
              value={formData.other_second_given}
              id='other_second_given'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='3rd Dose Given'
              name='other_third_given'
              value={formData.other_third_given}
              id='other_third_given'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='4th Dose Given'
              name='other_fourth_given'
              value={formData.other_fourth_given}
              id='other_fourth_given'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='5th Dose Given'
              name='other_fifth_given'
              value={formData.other_fifth_given}
              id='other_fifth_given'
              onChange={handleInputChange}
              hasLabel
            />
          </div>
        </div>

        <div className='space-y-2'>
          <h4 className='text-lg font-semibold text-gray-800 border-b pb-2'>
            Comeback Dates
          </h4>
          <div className='flex flex-col sm:flex-row items-center gap-2'>
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='1st Date Comeback'
              name='other_first_comeback'
              value={formData.other_first_comeback}
              id='other_first_comeback'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='2nd Date Comeback'
              name='other_second_comeback'
              value={formData.other_second_comeback}
              id='other_second_comeback'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='3rd Date Comeback'
              name='other_third_comeback'
              value={formData.other_third_comeback}
              id='other_third_comeback'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='4th Date Comeback'
              name='other_fourth_comeback'
              value={formData.other_fourth_comeback}
              id='other_fourth_comeback'
              onChange={handleInputChange}
              hasLabel
            />
            <DatePicker
              options={pickerNoWeekendsOptions}
              label='5th Date Comeback'
              name='other_fifth_comeback'
              value={formData.other_fifth_comeback}
              id='other_fifth_comeback'
              onChange={handleInputChange}
              hasLabel
            />
          </div>
        </div>
      </div>
    </div>
  );

  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const groupErrors = (errors) => {
    const groups = {
      general: { title: 'General Errors', errors: [] },
      tetanus: { title: 'Tetanus Vaccine Errors', errors: [] },
      covid: { title: 'COVID Vaccine Errors', errors: [] },
      other: { title: 'Other Vaccine Errors', errors: [] },
      followup: { title: 'Follow-up Date Errors', errors: [] },
    };

    Object.entries(errors).forEach(([field, fieldErrors]) => {
      fieldErrors.forEach((error) => {
        const errorItem = { field, error };

        if (field === 'patient_id' || field === 'vaccine') {
          groups.general.errors.push(errorItem);
        } else if (field.startsWith('tetanus_') && field.includes('comeback')) {
          groups.followup.errors.push(errorItem);
        } else if (field.startsWith('tetanus_')) {
          groups.tetanus.errors.push(errorItem);
        } else if (field.startsWith('covid_') && field.includes('comeback')) {
          groups.followup.errors.push(errorItem);
        } else if (field.startsWith('covid_')) {
          groups.covid.errors.push(errorItem);
        } else if (field.startsWith('other_') && field.includes('comeback')) {
          groups.followup.errors.push(errorItem);
        } else if (field.startsWith('other_')) {
          groups.other.errors.push(errorItem);
        } else if (field.includes('comeback')) {
          groups.followup.errors.push(errorItem);
        } else {
          groups.general.errors.push(errorItem);
        }
      });
    });

    // Filter out empty groups
    return Object.entries(groups).filter(
      ([_, group]) => group.errors.length > 0
    );
  };

  const getFieldDisplayName = (field) => {
    const fieldNames = {
      patient_id: 'Patient',
      tetanus_first_given: 'Tetanus First Dose',
      tetanus_second_given: 'Tetanus Second Dose',
      tetanus_third_given: 'Tetanus Third Dose',
      tetanus_fourth_given: 'Tetanus Fourth Dose',
      tetanus_fifth_given: 'Tetanus Fifth Dose',
      covid_first_given: 'COVID First Dose',
      covid_second_given: 'COVID Second Dose',
      covid_booster_given: 'COVID Booster',
      other_vaccine_name: 'Vaccine Name',
      other_first_given: 'Other Vaccine First Dose',
      tetanus_first_comeback: 'Tetanus First Follow-up',
      covid_second_comeback: 'COVID Second Follow-up',
      vaccine: 'Vaccine Selection',
    };

    return (
      fieldNames[field] ||
      field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const groupedErrors = groupErrors(error);
  const totalErrors = Object.values(error).flat().length;

  // Component for displaying when there are actual validation errors from backend
  //   if (Object.keys(error).length === 0) {
  //     return (
  //       <div className='space-y-8'>
  //         <div className='mt-8 p-4 bg-green-50 rounded-lg'>
  //           <h3 className='text-sm inline-flex items-center gap-2 font-medium text-green-800'>
  //             <FileWarning className='h-5 w-5' />
  //             <span>No validation errors - form is valid!</span>
  //           </h3>
  //         </div>
  //       </div>
  //     );
  //   }

  return (
    <div className='w-full'>
      <div className='space-y-2'>
        {Object.keys(error).length > 0 && (
          <div className='mt-8 p-4 bg-red-50 rounded-lg'>
            <h3 className='text-sm inline-flex items-center gap-2 font-medium text-red-800 mb-2'>
              <FileWarning className='h-5 w-5' />
              <span>
                Validation Errors ({totalErrors}{' '}
                {totalErrors === 1 ? 'error' : 'errors'})
              </span>
            </h3>

            {/* Simple list view - uncomment this and comment accordion for simple display */}
            {/* <ul className='text-sm text-red-700 space-y-1'>
            {Object.entries(validationErrors).map(([field, errors]) =>
              errors.map((error, index) => (
                <li
                  key={`${field}-${index}`}
                  className='flex items-start gap-2'
                >
                  <span className='text-red-400 mt-1'>•</span>
                  <span>
                    <strong>{getFieldDisplayName(field)}:</strong> {error}
                  </span>
                </li>
              ))
            )}
          </ul> */}

            {/* Accordion view */}
            <div className='space-y-2'>
              {groupedErrors.map(([groupKey, group]) => (
                <div
                  key={groupKey}
                  className='border border-red-200 rounded-md'
                >
                  <button
                    onClick={() => toggleSection(groupKey)}
                    className='w-full flex items-center justify-between p-3 text-left bg-red-100 hover:bg-red-150 transition-colors duration-200 rounded-t-md'
                  >
                    <div className='flex items-center gap-2'>
                      <AlertCircle className='h-4 w-4 text-red-600' />
                      <span className='font-medium text-red-800'>
                        {group.title}
                      </span>
                      <span className='text-xs text-red-600 bg-red-200 px-2 py-1 rounded-full'>
                        {group.errors.length}
                      </span>
                    </div>
                    {openSections[groupKey] ? (
                      <ChevronDown className='h-4 w-4 text-red-600' />
                    ) : (
                      <ChevronRight className='h-4 w-4 text-red-600' />
                    )}
                  </button>

                  {openSections[groupKey] && (
                    <div className='p-3 bg-white border-t border-red-200'>
                      <ul className='text-sm text-red-700 space-y-2'>
                        {group.errors.map((errorItem, index) => (
                          <li key={index} className='flex flex-col gap-1'>
                            <div className='flex items-start gap-2'>
                              <span className='text-red-400 mt-1'>•</span>
                              <div>
                                <span className='font-medium text-red-800'>
                                  {getFieldDisplayName(errorItem.field)}:
                                </span>
                                <span className='ml-2'>{errorItem.error}</span>
                              </div>
                            </div>
                            <div className='ml-4 text-xs text-red-500'>
                              Field:{' '}
                              <code className='bg-red-100 px-1 rounded'>
                                {errorItem.field}
                              </code>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patient ID Field */}
        <div className='bg-gray-50 p-4 rounded-lg'>
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
            setFormData={setFormData}
            labelKey='fullname'
          />
          {error.pregnancy_tracking_id && (
            <p className='error mt-1'>{error.pregnancy_tracking_id[0]}</p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className='border-b border-gray-200'>
          <nav className='flex justify-between space-x-8'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type='button'
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col sm:flex-row  items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className='text-lg'>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='mt-8'>
          <div className='bg-white border border-gray-200 rounded-lg p-6'>
            {activeTab === 'tetanus' && <TetanusForm />}
            {activeTab === 'covid' && <CovidForm />}
            {activeTab === 'other' && <OtherForm />}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200'>
          <button
            type='button'
            className='flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200'
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type='button'
            onClick={onSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transform transition-all duration-200 shadow-lg ${
              isSubmitting
                ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className='flex items-center justify-center space-x-2'>
                <span>{isEdit ? 'Updating ...' : 'Creating ...'}</span>
              </div>
            ) : (
              <span>{isEdit ? 'Update Record' : 'Create Record'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Help Text */}
      {/* <div className='mt-8 p-4 bg-blue-50 rounded-lg'>
        <h3 className='text-sm font-medium text-blue-800 mb-2'>
          💡 Quick Tips:
        </h3>
        <ul className='text-sm text-blue-700 space-y-1'>
          <li>• Switch between tabs to manage different vaccine types</li>
          <li>• Vaccination dates record when doses were administered</li>
          <li>• Follow-up dates help schedule future appointments</li>
          <li>
            • Only fill in the fields that apply to your patient's vaccination
            history
          </li>
        </ul>
      </div> */}
    </div>
  );
};

export default ImmunizationForm;
