import React, { useRef, useState } from 'react';
import DataTable from '../../components/ui/Datatable';
import Container from '../../components/ui/Container';
import InputGroup from '../../components/ui/InputGroup';
import FormModal from '../../components/ui/FormModal';
import { useFormSubmit } from '../../utils/functions';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import SelectGroup from '../../components/ui/SelectGroup';
import { user_columns } from '../../utils/columns';
import SelectReact from '../../components/ui/SelectReact';

const UserRecords = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: '',
    barangay_center_id: '',
    password: '',
    password_confirmation: '',
  });
  const [userId, setUserId] = useState(0);
  const dataTableRef = useRef();

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setUserId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData({
      name: '',
      email: '',
      role_id: '',
      barangay_center_id: '',
      password: '',
      password_confirmation: '',
    });
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setUserId(row.id);
    setFormData({
      name: row.name,
      email: row.email,
      role_id: row.role_id,
      barangay_center_id: row.barangay_center_id,
      password: '',
      password_confirmation: '',
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
      url: isEdit ? `/api/users/${userId}` : '/api/users',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData({
          name: '',
          email: '',
          role_id: '',
          barangay_center_id: '',
          password: '',
          password_confirmation: '',
        });
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setUserId(0);
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

  const columns = user_columns;
  return (
    <Container title={'User Managemnet'}>
      <DataTable
        title='User Management'
        apiEndpoint='/api/users'
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
        addButton={'Add User'}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal closeModal={closeModal} isEdit={isEdit} title={'User'}>
          <form onSubmit={onSubmit}>
            <div className='space-y-6 sm:w-auto'>
              <div className='flex justify-between gap-2'>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='name'
                    noNumbers
                    required
                    value={formData.name}
                    onChange={inputChange}
                    placeholder='Name'
                    icon={<User className='h-5 w-5 text-gray-400' />}
                    id={'name'}
                    hasLabel
                    label={'Name'}
                  />
                  {error.name && <p className='error -mt-4'>{error.name[0]}</p>}
                </div>
                <div className='w-full'>
                  <InputGroup
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={inputChange}
                    placeholder='Email'
                    icon={<Mail className='h-5 w-5 text-gray-400' />}
                    id={'email'}
                    hasLabel
                    label={'Email'}
                    required
                  />
                  {error.email && (
                    <p className='error -mt-4'>{error.email[0]}</p>
                  )}
                </div>
              </div>

              <SelectReact
                label='Role'
                id='role_id'
                name='role_id'
                endpoint='/api/filter/roles'
                placeholder='Choose a role'
                formData={formData}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    role_id: value,
                    barangay_center_id:
                      value == 2 ? prev.barangay_center_id : null,
                  }))
                }
                setFormData={setFormData}
                labelKey={'role'}
                required
              />
              {error.role_id && (
                <p className='error -mt-4'>{error.role_id[0]}</p>
              )}

              {formData.role_id == 2 && (
                <SelectReact
                  label='Barangay (Optional, only for midwife role)'
                  id='barangay_id'
                  name='barangay_center_id'
                  endpoint='/api/barangay-centers'
                  placeholder='Choose a health station'
                  formData={formData}
                  setFormData={setFormData}
                  labelKey={'health_station'}
                  disabled={formData.role_id != 2}
                />
              )}
              {error.barangay_center_id && (
                <p className='error -mt-4'>{error.barangay_center_id[0]}</p>
              )}

              <div className='flex justify-between gap-2 -mt-2'>
                <InputGroup
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  name='password'
                  onChange={inputChange}
                  placeholder='Password'
                  icon={<Lock className='h-5 w-5 text-gray-400' />}
                  id={'password'}
                  hasLabel
                  label={'Password'}
                  required
                >
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPassword ? (
                      <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    )}
                  </button>
                </InputGroup>

                <InputGroup
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  value={formData.password_confirmation}
                  name='password_confirmation'
                  onChange={inputChange}
                  placeholder='Confirm Password'
                  icon={<Lock className='h-5 w-5 text-gray-400' />}
                  id={'password_confirmation'}
                  hasLabel
                  label={'Confirm Password'}
                  required
                >
                  <button
                    type='button'
                    onClick={() =>
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  >
                    {showPasswordConfirmation ? (
                      <EyeOff className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400 hover:text-gray-600' />
                    )}
                  </button>
                </InputGroup>
              </div>
              {error.password && (
                <p className='error -mt-4'>{error.password[0]}</p>
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

export default UserRecords;
