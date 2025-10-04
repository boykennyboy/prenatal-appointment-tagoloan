import React, { useRef, useState } from 'react';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { useNavigate } from 'react-router';
import { appointment_columns } from '../../utils/columns';
import FormModal from '../../components/ui/FormModal';

const Appointments = () => {
  const navigate = useNavigate();
  const dataTableRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [row, setRow] = useState(null);

  const navigateEdit = (row, type) => {
    navigate('create', { state: { row, type: type } });
  };

  const handleEdit = (row) => {
    setIsOpen(true);
    setRow(row);
  };

  const closeModal = () => {
    setIsOpen(false);
    setRow(null);
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
        ref={dataTableRef}
        isAppointment
      />

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
