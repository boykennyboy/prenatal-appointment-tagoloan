
import * as XLSX from 'exceljs';
import api from '../../api/axios';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { out_patient_column } from '../../utils/columns';

const OutPatientReports = () => {
  const columns = out_patient_column;

  const downloadReport = async () => {
    try {
      // Show loading state
      console.log('Generating Excel report...');

      const params = {
        report: true,
      };

      // Fetch all pregnancy tracking data
      const response = await api.get('/api/out-patients', { params });
      const allData = response.data?.data || response.data || [];

      // Create workbook
      const workbook = new XLSX.Workbook();
      workbook.creator = 'Out Patients System';
      workbook.created = new Date();

      // Helper function to filter columns (exclude IDs except 'id', but include hidden columns)
      const filterColumns = (data) => {
        return data.map((row) => {
          const filteredRow = {};
          Object.keys(row).forEach((key) => {
            // Include 'id', exclude other '_id' fields and exclude region/province/municipality/barangay
            if (key === 'id' || !key.toLowerCase().includes('_id')) {
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
      addWorksheet(workbook, 'All Data', allData, 'All Out Patients');

      // 2. By Attended By
      const attendedBy = allData.reduce((acc, item) => {
        const doctor =
          item.attending_physician || item.doctor_name || 'Unknown';
        if (!acc[doctor]) {
          acc[doctor] = [];
        }
        acc[doctor].push(item);
        return acc;
      }, {});

      // Create separate sheets for each health doctor
      Object.keys(attendedBy).forEach((doctor) => {
        const sheetName = `Physician - ${doctor}`.substring(0, 31); // Excel sheet name limit
        addWorksheet(
          workbook,
          sheetName,
          attendedBy[doctor],
          `Physician: ${doctor}`
        );
      });

      // NEW: Group by Month based on created_at
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

      // Group createdAt by month-year
      const createAt = {};

      allData.forEach((item) => {
        if (item.created_at) {
          const date = new Date(item.created_at);
          const monthYear = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, '0')}`;
          const monthLabel = `${
            monthNames[date.getMonth()]
          } ${date.getFullYear()}`;

          if (!createAt[monthYear]) {
            createAt[monthYear] = {
              label: monthLabel,
              data: [],
            };
          }
          createAt[monthYear].data.push(item);
        }
      });

      // Sort months chronologically and add worksheets
      const sortedMonths = Object.keys(createAt).sort();

      sortedMonths.forEach((monthYear) => {
        const { label, data } = createAt[monthYear];
        addWorksheet(workbook, label, data, label);
      });

      // 3. Summary Sheet
      const summaryWorksheet = workbook.addWorksheet('Summary');

      // Summary data
      const summaryData = [
        ['Total Out Patient Records', allData.length],
        [''],
        ['By Attending Physician:'],
        ...Object.keys(attendedBy).map((physician) => [
          physician,
          attendedBy[physician].length,
        ]),
        [''],
        ['Created By Month:', ''],
        ...sortedMonths.map((monthYear) => [
          createAt[monthYear].label,
          createAt[monthYear].data.length,
        ]),
        [''],
        ['Report Generated:', new Date().toLocaleString()],
      ];

      // Add summary data
      summaryData.forEach((row, index) => {
        const summaryRow = summaryWorksheet.addRow(row);

        // Style header rows
        if (index === 7 || row[0] === 'Report Generated:') {
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
      a.download = `Out_Patient_Report_${
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
    { label: 'Out Patient Reports' },
  ];

  return (
    <Container title={'Reports - Out Patients'}>
      <Breadcrumb items={Items} />
      <DataTable
        title='Out Patients'
        apiEndpoint='/api/out-patients'
        columns={columns}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={false}
        defaultPerPage={10}
        downloadReport={'Export Out Patients'}
        onDownloadReport={downloadReport}
      />
    </Container>
  );
};

export default OutPatientReports;
