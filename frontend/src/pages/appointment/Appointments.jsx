import React, { useRef, useState } from 'react';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { useNavigate } from 'react-router';
import { appointment_columns } from '../../utils/columns';
import FormModal from '../../components/ui/FormModal';
import UnifiedForm from '../../components/forms/unified_form/UnifiedForm';
import { useAuthStore } from '../../store/authStore.js';
import { useFormSubmit } from '../../utils/functions.jsx';
import { prenatal_outpatient_immunization_form_data } from '../../utils/formDefault.jsx';

const Appointments = () => {
  const navigate = useNavigate();
  const dataTableRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUnifiedForm, setIsOpenUnifiedForm] = useState(false);
  const [row, setRow] = useState(null);
  const [formData, setFormData] = useState(
    prenatal_outpatient_immunization_form_data
  );

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const { user } = useAuthStore();

  const navigateEdit = (row, type) => {
    navigate('create', { state: { row, type: type } });
  };

  const handleEdit = (row) => {
    setIsOpen(true);
    setRow(row);
  };

  const closeModal = () => {
    setIsOpenUnifiedForm(false);
    setIsOpen(false);
    setRow(null);
    setFormData(prenatal_outpatient_immunization_form_data);
    setError({});
  };

  const handleAdd = () => {
    setIsOpenUnifiedForm(true);
  };

  const onSubmit = (e, showImmunization, setShowImmunization) => {
    e.preventDefault();

    // Prepare the data to send
    let dataToSend = { ...formData };

    // // If patient is NOT in third trimester, remove all immunization fields
    if (!showImmunization) {
      const {
        tetanus_first_given,
        tetanus_second_given,
        tetanus_third_given,
        tetanus_fourth_given,
        tetanus_fifth_given,
        tetanus_first_comeback,
        tetanus_second_comeback,
        tetanus_third_comeback,
        tetanus_fourth_comeback,
        tetanus_fifth_comeback,
        covid_first_given,
        covid_second_given,
        covid_booster_given,
        covid_first_comeback,
        covid_second_comeback,
        covid_booster_comeback,
        other_vaccine_name,
        other_first_given,
        other_second_given,
        other_third_given,
        other_fourth_given,
        other_fifth_given,
        other_first_comeback,
        other_second_comeback,
        other_third_comeback,
        other_fourth_comeback,
        other_fifth_comeback,
        ...prenatalDataOnly
      } = dataToSend;

      dataToSend = prenatalDataOnly;
    }

    handleSubmit({
      e,
      url: '/api/unified-form/store',
      formData: dataToSend,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData(prenatal_outpatient_immunization_form_data);
        setError({});
        setShowImmunization(false);
        setIsOpenUnifiedForm(false);
      },
    });
  };

  const columns = appointment_columns;

  return (
    <Container title={'Appointments'}>
      <DataTable
        title='Appointments'
        apiEndpoint='/api/appointments'
        columns={columns}
        onEdit={handleEdit}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        hasSortByPregnancyStatus
        hasSortByStatus
        hasSortByPriority
        hasAdvanceFilter
        onAdd={handleAdd}
        addButton={user.role_id !== 2 ? 'Add Prenatal Care' : ''}
        ref={dataTableRef}
        isAppointment
      />

      {isOpenUnifiedForm && (
        <FormModal
          closeModal={closeModal}
          title={'Prenatal Care Form'}
          className={'sm:max-w-6xl'}
        >
          <UnifiedForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            error={error}
            isSubmitting={isSubmitting}
          />
        </FormModal>
      )}

      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isOpen}
          title={'Appointment'}
        >
          <div className='w-full'>
            <h2 className='text-lg mb-4'>Select Edit Type</h2>
            <div className='flex flex-col gap-5 w-full'>
              <button
                onClick={() => navigateEdit(row, 'reschedule')}
                className='px-5 py-8 bg-gray-100 rounded-lg text-lg shadow-lg border border-gray-200 transition-all duration-300 hover:bg-gray-200 cursor-pointer'
              >
                Reschedule Appointment
              </button>
              <button
                onClick={() => navigateEdit(row, 'update info')}
                className='px-5 py-8 bg-gray-100 rounded-lg text-lg shadow-lg border-gray-200 transition-all duration-300 hover:bg-gray-200 cursor-pointer'
              >
                Update Patient Information Only
              </button>
            </div>
          </div>
        </FormModal>
      )}
    </Container>
  );
};

export default Appointments;
