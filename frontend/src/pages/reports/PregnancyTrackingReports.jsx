import * as XLSX from 'exceljs';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { pregnancy_tracking_columns } from '../../utils/columns';
import api from '../../api/axios';

const PregnancyTrackingReports = () => {
  const columns = pregnancy_tracking_columns;

  const downloadReport = async () => {
    try {
      // Show loading state
      console.log('Generating Excel report...');

      const params = {
        report: true,
      };

      // Fetch all pregnancy tracking data
      const response = await api.get('/api/pregnancy-trackings', { params });
      const allData = response.data?.data || response.data || [];

      // Create workbook
      const workbook = new XLSX.Workbook();
      workbook.creator = 'Pregnancy Tracking System';
      workbook.created = new Date();

      // Helper function to format risks data
      const formatRisks = (risks) => {
        if (!risks || !Array.isArray(risks) || risks.length === 0) {
          return 'No risks identified';
        }

        return risks
          .map((risk, index) => {
            const riskCode = risk.risk_code || 'Unknown Code';
            const status = risk.risk_status || 'Unknown status';
            const dateDetected = risk.date_detected
              ? new Date(risk.date_detected).toLocaleDateString()
              : 'No date';

            return `${
              index + 1
            }. ${riskCode} (${status}) - Detected: ${dateDetected}`;
          })
          .join('\n');
      };

      const formatPregnancyStatus = (status) => {
        let ps = '';
        switch (status) {
          case 'first_trimester':
            ps = '1st Trimester';
            break;
          case 'secondt_trimester':
            ps = '2nd Trimester';
            break;
          case 'third_trimester':
            ps = '3rd Trimester';
            break;
          case 'completed':
            ps = 'Completed';
            break;

          default:
            ps = 'Referral';
            break;
        }

        return ps;
      };

      // Helper function to filter columns (exclude IDs except 'id', but include hidden columns)
      const filterColumns = (data) => {
        return data.map((row) => {
          const filteredRow = {};
          Object.keys(row).forEach((key) => {
            // Include 'id', exclude other '_id' fields and exclude region/province/municipality/barangay
            if (
              key === 'id' ||
              (!key.toLowerCase().includes('_id') &&
                key !== 'region' &&
                key !== 'province' &&
                key !== 'municipality' &&
                key !== 'barangay')
            ) {
              // Format risks column specially
              if (key === 'risk_codes') {
                filteredRow[key] = formatRisks(row[key]);
              } else if (key === 'created_at' || key === 'updated_at') {
                const date = new Date(row[key]);
                filteredRow[key] = date.toLocaleDateString('en-CA');
              } else if (key === 'pregnancy_status') {
                filteredRow[key] = formatPregnancyStatus(row[key]);
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

            // Find risks column and apply special formatting
            const columnKey = headers[colIndex - 1]; // colIndex is 1-based
            if (columnKey === 'risk_codes') {
              // Enable text wrapping for risks column
              cell.alignment = {
                wrapText: true,
                vertical: 'top',
                horizontal: 'left',
              };

              // Calculate row height based on number of lines in risks
              const cellValue = cell.value?.toString() || '';
              const lineCount = (cellValue.match(/\n/g) || []).length + 1;
              const minRowHeight = Math.max(15, lineCount * 15); // 15 points per line

              // Set row height if it contains multiple risks
              if (lineCount > 1) {
                dataRow.height = minRowHeight;
              }
            }
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

          // Special width handling for risks column
          if (columnKey === 'risk_codes') {
            // Set a wider width for risks column to accommodate formatted content
            column.width = Math.min(Math.max(maxLength + 5, 40), 100);
          } else {
            // Set column width with reasonable limits for other columns
            column.width = Math.min(Math.max(maxLength + 2, 15), 80);
          }
        });
      };

      // 1. All Pregnancy Tracking Data
      addWorksheet(workbook, 'All Data', allData, 'All Pregnancy Tracking');

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

      const abortionData = allData.filter(
        (item) =>
          item.pregnancy_status?.toLowerCase() === 'miscarriage_abortion' ||
          item.status?.toLowerCase() === 'miscarriage_abortion'
      );
      addWorksheet(
        workbook,
        'Miscarriage or Abortion',
        abortionData,
        'Miscarriage or Abortion'
      );

      const discontinuedData = allData.filter(
        (item) =>
          item.pregnancy_status?.toLowerCase() === 'discontinued' ||
          item.status?.toLowerCase() === 'discontinued'
      );
      addWorksheet(workbook, 'Discontinued', discontinuedData, 'Discontinued');

      const hasPhic = allData.filter(
        (item) => item.phic === true || item.phic === 1
      );
      addWorksheet(workbook, 'Has PhilHealth', hasPhic, 'Has PhilHealth');

      // 6. By Referral (empty pregnancy status)
      const referralData = allData.filter(
        (item) =>
          !item.pregnancy_status ||
          item.pregnancy_status === '' ||
          item.pregnancy_status?.toLowerCase() === 'referral' ||
          item.status === '' ||
          item.status?.toLowerCase() === 'referral'
      );
      addWorksheet(workbook, 'Referral', referralData, 'Referral');

      // 7. By Health Station
      const healthStationData = allData.reduce((acc, item) => {
        const station = item.health_station || item.healthStation || 'Unknown';
        if (!acc[station]) {
          acc[station] = [];
        }
        acc[station].push(item);
        return acc;
      }, {});

      // Create separate sheets for each health station
      Object.keys(healthStationData).forEach((station) => {
        const sheetName = `HS - ${station}`.substring(0, 31); // Excel sheet name limit
        addWorksheet(
          workbook,
          sheetName,
          healthStationData[station],
          `Health Station: ${station}`
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

      // 8. Summary Sheet
      const summaryWorksheet = workbook.addWorksheet('Summary');

      // Summary data
      const summaryData = [
        ['Total Pregnancy Tracking Records', allData.length],
        ['First Trimester', firstTrimesterData.length],
        ['Second Trimester', secondTrimesterData.length],
        ['Third Trimester', thirdTrimesterData.length],
        ['Completed', completedData.length],
        ['Miscarriage or Abortion', abortionData.length],
        ['Discontinued', discontinuedData.length],
        ['Has Philhealth', hasPhic.length],
        ['Referral', referralData.length],
        [''],
        ['By Health Station:'],
        ...Object.keys(healthStationData).map((station) => [
          station,
          healthStationData[station].length,
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
      a.download = `Pregnancy_Tracking_Report_${
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
    { label: 'Pregnancy Tracking Reports' },
  ];

  return (
    <Container title={'Reports - Pregnancy Tracking'}>
      <Breadcrumb items={Items} />
      <DataTable
        title='Pregnancy Tracking'
        apiEndpoint='/api/pregnancy-trackings'
        columns={columns}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={false}
        defaultPerPage={10}
        hasSortByCategory
        hasSortByStatus
        hasAdvanceFilter
        downloadReport={'Export Pregnancy Tracking'}
        onDownloadReport={downloadReport}
      />
    </Container>
  );
};

export default PregnancyTrackingReports;
