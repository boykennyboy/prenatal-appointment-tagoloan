import React, { useRef, useState } from 'react';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { useFormSubmit } from '../../utils/functions';
import FormModal from '../../components/ui/FormModal';
import InputGroup from '../../components/ui/InputGroup';
import { User } from 'lucide-react';
import SelectGroup from '../../components/ui/SelectGroup';
import { useAuthStore } from '../../store/authStore.js';
import { doctor_columns } from '../../utils/columns.jsx';

const DoctorManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    assigned_day: '',
  });
  const [doctorId, setDoctorId] = useState(0);
  const dataTableRef = useRef();
  const { user } = useAuthStore();

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setDoctorId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData({
      firstname: '',
      lastname: '',
      assigned_day: '',
    });
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setDoctorId(row.id);
    setFormData({
      firstname: row.firstname,
      lastname: row.lastname,
      assigned_day: row.assigned_day,
    });

    setIsOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  const onSubmit = (e) => {
    handleSubmit({
      e,
      isEdit,
      url: isEdit ? `/api/doctors/${doctorId}` : '/api/doctors',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData({
          firstname: '',
          lastname: '',
          assigned_day: '',
        });
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setDoctorId(0);
          setIsEdit(false);
        }
      },
    });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const day_options = [
    {
      name: 'monday',
    },
    {
      name: 'tuesday',
    },
    {
      name: 'wednesday',
    },
    {
      name: 'thursday',
    },
    {
      name: 'friday',
    },
  ];

  const columns = doctor_columns;

  return (
    <Container title={'Doctor Management'}>
      <DataTable
        title='Doctor Management'
        apiEndpoint='/api/doctors'
        columns={columns}
        onEdit={handleEdit}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        onAdd={handleAdd}
        addButton={user.role_id === 2 ? '' : 'Add Doctor'}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal closeModal={closeModal} isEdit={isEdit} title={'Nurse'}>
          <form onSubmit={onSubmit}>
            <div className='space-y-6 sm:w-auto'>
              <div className='flex justify-between gap-2 -mt-2'>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='firstname'
                    value={formData.firstname}
                    onChange={inputChange}
                    placeholder='Firstname'
                    icon={<User className='h-5 w-5 text-gray-400' />}
                    id={'firstname'}
                    hasLabel
                    label={'Firstname'}
                  />
                  {error.firstname && (
                    <p className='error -mt-4'>{error.firstname[0]}</p>
                  )}
                </div>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='lastname'
                    value={formData.lastname}
                    onChange={inputChange}
                    placeholder='Lastname'
                    icon={<User className='h-5 w-5 text-gray-400' />}
                    id={'lastname'}
                    hasLabel
                    label={'Lastname'}
                  />
                  {error.lastname && (
                    <p className='error -mt-4'>{error.lastname[0]}</p>
                  )}
                </div>
              </div>

              <SelectGroup
                placeholder='Select Day'
                value={formData.assigned_day}
                onChange={inputChange}
                options={day_options}
                name={'assigned_day'}
                id={'assigned_day'}
                hasLabel
                label={'Assigned Day'}
              />
              {error.assigned_day && (
                <p className='error -mt-4'>{error.assigned_day[0]}</p>
              )}

              {/* Login Button */}
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
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </form>
        </FormModal>
      )}
    </Container>
  );
};

export default DoctorManagement;
