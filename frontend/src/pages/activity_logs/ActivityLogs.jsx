import React from 'react';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { activity_log_columns } from '../../utils/columns';

const ActivityLogs = () => {
  const columns = activity_log_columns;
  return (
    <Container title={'Activity Logs'}>
      <DataTable
        title='Activity Logs'
        apiEndpoint='/api/activity-logs'
        columns={columns}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={false}
        hasSortByAction
        hasAdvanceFilter
        defaultPerPage={10}
      />
    </Container>
  );
};

export default ActivityLogs;
