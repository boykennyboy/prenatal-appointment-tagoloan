import React from 'react';
import { immunization_records_columns } from '../../utils/columns';
import Breadcrumb from '../../components/ui/Breadcrumb';
import DataTable from '../../components/ui/Datatable';

const ImmunizationReports = () => {
  const downloadReport = () => {};

  const Items = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Reports', to: '/admin/reports' },
    { label: 'Prenatal Visit Reports' },
  ];

  const columns = immunization_records_columns;

  return (
    <Container title={'Reports - Prenatal Visit'}>
      <Breadcrumb items={Items} />
      <DataTable
        title='Prenatal Visit'
        apiEndpoint='/api/prenatal-visits'
        columns={columns}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={false}
        defaultPerPage={10}
        downloadReport={'Export Prenatal Visit'}
        onDownloadReport={downloadReport}
      />
    </Container>
  );
};

export default ImmunizationReports;
