import React, { useRef, useState } from 'react';
import DataTable from '../../components/ui/Datatable';
import Container from '../../components/ui/Container';
import { immunization_records_columns } from '../../utils/columns';
import FormModal from '../../components/ui/FormModal';
import { useFormSubmit } from '../../utils/functions';
import ImmunizationForm from '../../components/forms/immunizations/ImmunizationForm';
import { useAuthStore } from '../../store/authStore.js';
import {
  immunizationEditFormData,
  immunizationFormData,
} from '../../utils/formDefault';
import ImmunizationPDF from '../../components/interfaces/pdf/ImmunizationPDF';
import { pdf } from '@react-pdf/renderer';

const ImmunizationRecords = () => {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(immunizationFormData);
  const [immunizationId, setImmunizationId] = useState(0);
  const dataTableRef = useRef();

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const vaccineFields = {
    tetanus: ['first', 'second', 'third', 'fourth', 'fifth'],
    covid: ['first', 'second', 'booster'],
    other: ['first', 'second', 'third', 'fourth', 'fifth'],
  };

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setImmunizationId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData(immunizationFormData);
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setImmunizationId(row.id);
    setFormData(immunizationEditFormData(row));

    setIsOpen(true);
  };

  const handelDownload = async (row) => {
    const blob = await pdf(<ImmunizationPDF formData={row} />).toBlob();

    const url = URL.createObjectURL(blob);

    // ✅ Trigger browser download
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'pregnancy-tracking.pdf'; // filename
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsOpen(true);
    setFormData(immunizationFormData);
  };

  const onSubmit = (e) => {
    handleSubmit({
      e,
      isEdit,
      url: isEdit
        ? `/api/immunization-records/${immunizationId}`
        : '/api/immunization-records',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData(immunizationFormData);
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setImmunizationId(0);
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

  const columns = immunization_records_columns;

  return (
    <Container title={'Immunization Records'}>
      <DataTable
        title='Immunization Records'
        apiEndpoint='/api/immunization-records'
        columns={columns}
        onEdit={handleEdit}
        onDownload={handelDownload}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        onAdd={handleAdd}
        addButton={user.role_id !== 2 ? 'Add Immunization Record' : ''}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isEdit}
          title={'Immuzation Record'}
          className={'sm:max-w-6xl'}
        >
          <ImmunizationForm
            onSubmit={onSubmit}
            inputChange={inputChange}
            formData={formData}
            setFormData={setFormData}
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            error={error}
            onClose={closeModal}
          />
        </FormModal>
      )}
    </Container>
  );
};

export default ImmunizationRecords;
