import { useState } from 'react';
import * as XLSX from 'exceljs';
import Container from '../../components/ui/Container';
import { appointment_columns } from '../../utils/columns';
import api from '../../api/axios';
import DataTable from '../../components/ui/Datatable';
import Breadcrumb from '../../components/ui/Breadcrumb';

const AppointmentReports = () => {
  const [formDate, setFormDate] = useState({
    start_date: '',
    end_date: '',
  });

  const downloadReport = async () => {
    try {
      // Show loading state
      console.log('Generating Excel report...');

      const params = {
        report: true,
        start_date: formDate.start_date
          ? formDate.start_date.toLocaleDateString('en-CA')
          : undefined,
        end_date: formDate.end_date
          ? (() => {
              const end = new Date(formDate.end_date);
              end.setHours(23, 59, 59, 999); // last millisecond of the day
              return `${end.toLocaleDateString('en-CA')} 23:59:59`;
            })()
          : undefined,
      };

      // Fetch all pregnancy tracking data
      const response = await api.get('/api/appointments', { params });
      const allData = response.data?.data || response.data || [];

      // Create workbook
      const workbook = new XLSX.Workbook();
      workbook.creator = 'Appointment Reports System';
      workbook.created = new Date();

      // Helper function to filter columns (exclude IDs except 'id', but include hidden columns)
      const filterColumns = (data) => {
        return data.map((row) => {
          const filteredRow = {};
          Object.keys(row).forEach((key) => {
            // Include 'id', exclude other '_id' fields and exclude region/province/municipality/barangay
            if (
              key === 'id' ||
              (!key.toLowerCase().includes('_id') &&
                key !== 'start_time' &&
                key !== 'end_time')
            ) {
              if (key === 'created_at' || key === 'updated_at') {
                const date = new Date(row[key]);
                filteredRow[key] = date.toLocaleDateString('en-CA');
              } else if (
                row[key] === null ||
                row[key] === undefined ||
                row[key] === ''
              ) {
                filteredRow[key] = '-';
              } else {
                filteredRow[key] = row[key];
              }
            }
          });
          return filteredRow;
        });
      };

      // Helper function to add worksheet
      const addWorksheet = (workbook, name, data, title) => {
        const worksheet = workbook.addWorksheet(name);

        if (data.length === 0) {
          worksheet.addRow([`No ${title.toLowerCase()} data available`]);
          return;
        }

        const filteredData = filterColumns(data);

        // Add headers
        const headers = Object.keys(filteredData[0]);
        const headerRow = worksheet.addRow(
          headers.map((header) => header.replace(/_/g, ' ').toUpperCase())
        );

        // Style headers
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: 'FFFFFF' } };
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '366092' },
          };
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          };
        });

        // Add data rows
        filteredData.forEach((row, rowIndex) => {
          const dataRow = worksheet.addRow(Object.values(row));

          dataRow.eachCell((cell, colIndex) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' },
            };
          });
        });

        // Auto-fit columns with special consideration for risks column
        worksheet.columns.forEach((column, index) => {
          let maxLength = 0;
          const columnLetter = String.fromCharCode(65 + index); // A, B, C, etc.
          const columnKey = headers[index];

          column.eachCell({ includeEmpty: true }, (cell) => {
            if (cell.value) {
              const cellValue = cell.value.toString();

              // For multi-line content (like risks), use the longest line for width calculation
              if (cellValue.includes('\n')) {
                const lines = cellValue.split('\n');
                const longestLine = lines.reduce((a, b) =>
                  a.length > b.length ? a : b
                );
                maxLength = Math.max(maxLength, longestLine.length);
              } else {
                maxLength = Math.max(maxLength, cellValue.length);
              }
            }
          });

          column.width = Math.min(Math.max(maxLength + 2, 15), 80);
        });
      };

      // 1. All Pregnancy Tracking Data
      addWorksheet(workbook, 'All Data', allData, 'All Prenatal Visits');

      const scheduledData = allData.filter(
        (item) => item.status.toLowerCase() === 'scheduled'
      );
      addWorksheet(workbook, 'Scheduled Status', scheduledData, 'Scheduled');

      const completedStatusData = allData.filter(
        (item) => item.status.toLowerCase() === 'completed'
      );
      addWorksheet(
        workbook,
        'Completed Status',
        completedStatusData,
        'Completed Status'
      );

      const missedData = allData.filter(
        (item) => item.status.toLowerCase() === 'missed'
      );
      addWorksheet(
        workbook,
        'Missed Appoinments',
        missedData,
        'Missed Appointments'
      );

      const highData = allData.filter(
        (item) => item.priority.toLowerCase() === 'high'
      );
      addWorksheet(workbook, 'High priority', highData, 'High');

      const lowData = allData.filter(
        (item) => item.priority.toLowerCase() === 'low'
      );
      addWorksheet(workbook, 'Low priority', lowData, 'Low');

      const priorityQueueData = allData.filter(
        (item) => item.priority.toLowerCase() === 'priority_queue'
      );
      addWorksheet(
        workbook,
        'Priority Queue',
        priorityQueueData,
        'Priority Queue'
      );

      const regularQueueData = allData.filter(
        (item) => item.priority.toLowerCase() === 'regular_queue'
      );
      addWorksheet(
        workbook,
        'Regular Queue',
        regularQueueData,
        'Regular Queue'
      );

      // 2. By First Trimester
      const firstTrimesterData = allData.filter(
        (item) =>
          item.pregnancy_status?.toLowerCase() === 'first_trimester' ||
          item.status?.toLowerCase() === 'first_trimester'
      );
      addWorksheet(
        workbook,
        'First Trimester',
        firstTrimesterData,
        'First Trimester'
      );

      // 3. By Second Trimester
      const secondTrimesterData = allData.filter(
        (item) =>
          item.pregnancy_status?.toLowerCase() === 'second_trimester' ||
          item.status?.toLowerCase() === 'second_trimester'
      );
      addWorksheet(
        workbook,
        'Second Trimester',
        secondTrimesterData,
        'Second Trimester'
      );

      // 4. By Third Trimester
      const thirdTrimesterData = allData.filter(
        (item) =>
          item.pregnancy_status?.toLowerCase() === 'third_trimester' ||
          item.status?.toLowerCase() === 'third_trimester'
      );
      addWorksheet(
        workbook,
        'Third Trimester',
        thirdTrimesterData,
        'Third Trimester'
      );

      // 5. By Completed
      const completedData = allData.filter(
        (item) =>
          item.pregnancy_status?.toLowerCase() === 'completed' ||
          item.status?.toLowerCase() === 'completed'
      );
      addWorksheet(workbook, 'Completed', completedData, 'Completed');

      // NEW: Group by Month based on appointment_date
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      // Group appointments by month-year
      const appointmentsByMonth = {};

      allData.forEach((item) => {
        if (item.appointment_date) {
          const date = new Date(item.appointment_date);
          const monthYear = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}`;
          const monthLabel = `${
            monthNames[date.getMonth()]
          } ${date.getFullYear()}`;

          if (!appointmentsByMonth[monthYear]) {
            appointmentsByMonth[monthYear] = {
              label: monthLabel,
              data: [],
            };
          }
          appointmentsByMonth[monthYear].data.push(item);
        }
      });

      // Sort months chronologically and add worksheets
      const sortedMonths = Object.keys(appointmentsByMonth).sort();

      sortedMonths.forEach((monthYear) => {
        const { label, data } = appointmentsByMonth[monthYear];
        addWorksheet(workbook, label, data, label);
      });

      // 6. Summary Sheet
      const summaryWorksheet = workbook.addWorksheet('Summary');

      // Summary data
      const summaryData = [
        ['Total Prenatal Visit Records', allData.length],
        ['Scheduled Status', scheduledData.length],
        ['Completed Status', completedStatusData.length],
        ['Missed Appointments', missedData.length],
        ['First Trimester', firstTrimesterData.length],
        ['Second Trimester', secondTrimesterData.length],
        ['Third Trimester', thirdTrimesterData.length],
        ['Completed', completedData.length],
        [''],
        ['High Priority', highData.length],
        ['Low Priority', lowData.length],
        ['Priority Queue', priorityQueueData.length],
        ['Regular Queue', regularQueueData.length],
        [''],
        ['Appointments By Month:', ''],
        ...sortedMonths.map((monthYear) => [
          appointmentsByMonth[monthYear].label,
          appointmentsByMonth[monthYear].data.length,
        ]),
        [''],
        ['Report Generated:', new Date().toLocaleString()],
      ];

      // Add summary data
      summaryData.forEach((row, index) => {
        const summaryRow = summaryWorksheet.addRow(row);

        // Style header rows
        if (
          index === 7 ||
          row[0] === 'Report Generated:' ||
          row[0] === 'By Month:'
        ) {
          summaryRow.getCell(1).font = { bold: true };
        }

        // Style total row
        if (index === 0) {
          summaryRow.eachCell((cell) => {
            cell.font = { bold: true, size: 14 };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'E7E6E6' },
            };
          });
        }
      });

      // Auto-fit summary columns
      summaryWorksheet.columns.forEach((column, index) => {
        column.width = index === 0 ? 30 : 15;
      });

      // Generate file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Appointment_Report_${
        new Date().toISOString().split('T')[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      console.log('Excel report generated successfully!');
    } catch (error) {
      console.error('Error generating Excel report:', error);
      alert('Error generating Excel report. Please try again.');
    }
  };

  const Items = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Reports', to: '/admin/reports' },
    { label: 'Appointment Reports' },
  ];

  const columns = appointment_columns;
  return (
    <Container title={'Appointments Reports'}>
      <Breadcrumb items={Items} />
      <DataTable
        title='Appointments Reports'
        apiEndpoint='/api/appointments'
        columns={columns}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={false}
        defaultPerPage={10}
        hasSortByPregnancyStatus
        hasSortByStatus
        hasSortByPriority
        hasAdvanceFilter
        isAppointment
        downloadReport={'Export All Appointments'}
        onDownloadReport={downloadReport}
        setFormDate={setFormDate}
      />
    </Container>
  );
};

export default AppointmentReports;
