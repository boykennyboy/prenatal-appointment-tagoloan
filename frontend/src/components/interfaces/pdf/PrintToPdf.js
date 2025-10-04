// form-wizard/PrintToPdf.js
export const printPdf = (formData, patientType) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>National Safe Motherhood Program - Pregnancy Tracking</title>
            <style>
              @media print {
                @page {
                  size: landscape;
                  margin: 0.5in;
                }
              }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 10px;
                font-size: 11px;
                background: white;
                line-height: 1.2;
              }
              .form-container {
                width: 100%;
                max-width: none;
              }
              .header {
                text-align: center;
                margin-bottom: 15px;
              }
              .header h1 {
                font-size: 14px;
                font-weight: bold;
                margin: 0 0 2px 0;
              }
              .header h2 {
                font-size: 12px;
                font-weight: bold;
                margin: 0 0 15px 0;
              }
              .info-section {
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
                font-size: 10px;
              }
              .info-left, .info-right {
                width: 48%;
              }
              .info-row {
                display: flex;
                margin-bottom: 4px;
                align-items: center;
              }
              .info-label {
                font-weight: normal;
                margin-right: 5px;
                min-width: 80px;
              }
              .info-value {
                border-bottom: 1px solid black;
                flex: 1;
                padding: 0 3px;
                min-height: 14px;
              }
              .main-table {
                width: 100%;
                border-collapse: collapse;
                border: 2px solid black;
                font-size: 9px;
              }
              .main-table th,
              .main-table td {
                border: 1px solid black;
                padding: 2px;
                text-align: center;
                vertical-align: middle;
              }
              .main-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                font-size: 8px;
                line-height: 1.1;
              }
              .main-table .name-cell {
                text-align: left;
                padding-left: 5px;
              }
              .no-cell { width: 25px; }
              .name-cell { width: 100px; }
              .age-cell { width: 30px; }
              .gravidity-cell { width: 40px; }
              .parity-cell { width: 40px; }
              .delivery-date-header { width: 90px; }
              .delivery-subcell { width: 30px; font-size: 7px; }
              .checkup-header { width: 280px; }
              .checkup-subcell { width: 70px; font-size: 7px; line-height: 1.0; }
              .pregnancy-outcome-header { width: 200px; }
              .outcome-subcell { width: 50px; font-size: 7px; line-height: 1.0; }
              .prenatal-header { width: 120px; }
              .prenatal-subcell { width: 60px; font-size: 7px; line-height: 1.0; }

              .data-row {
                height: 25px;
              }
              .empty-row {
                height: 22px;
              }
              .bottom-section {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
                font-size: 10px;
              }
              .bottom-left, .bottom-right {
                width: 48%;
              }
              .multi-line {
                white-space: pre-line;
                line-height: 1.0;
              }
            </style>
          </head>
          <body>
            <div class="form-container">
              <!-- Header -->
              <div class="header">
                <h1>National Safe Motherhood Program</h1>
                <h2>PREGNANCY TRACKING</h2>
              </div>

              <!-- Top Information Section -->
              <div class="info-section">
                <div class="info-left">
                  <div class="info-row">
                    <span class="info-label">Year:</span>
                    <span class="info-value">${new Date().getFullYear()}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Region:</span>
                    <span class="info-value">${formData.region || ''}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Province:</span>
                    <span class="info-value">${formData.province || ''}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Municipality:</span>
                    <span class="info-value">${
                      formData.municipality || ''
                    }</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Barangay:</span>
                    <span class="info-value">${formData.barangay || ''}</span>
                  </div>
                </div>
                <div class="info-right">
                  <div class="info-row">
                    <span class="info-label">Birthing Center:</span>
                    <span class="info-value">${
                      formData.birthing_center || ''
                    }</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${
                      formData.birthing_center_address || ''
                    }</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Referral Center:</span>
                    <span class="info-value">${
                      formData.referral_center || ''
                    }</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Address:</span>
                    <span class="info-value">${
                      formData.referral_center_address || ''
                    }</span>
                  </div>
                </div>
              </div>

              <!-- Main Table -->
              <table class="main-table">
                <!-- Header Row -->
                <thead>
                  <tr>
                    <th rowspan="2" class="no-cell">No.</th>
                    <th rowspan="2" class="name-cell">Name</th>
                    <th rowspan="2" class="age-cell">Age</th>
                    <th rowspan="2" class="gravidity-cell">Gravidity</th>
                    <th rowspan="2" class="parity-cell">Parity</th>
                    <th colspan="3" class="delivery-date-header">Expected Date of<br>Delivery</th>
                    <th colspan="4" class="checkup-header">Antenatal Care Check-Ups</th>
                    <th colspan="4" class="pregnancy-outcome-header">Pregnancy<br>Outcome</th>
                    <th colspan="2" class="prenatal-header">Mother and Child<br>Prenatal Check-up</th>
                  </tr>
                  <tr>
                    <th class="delivery-subcell">Month</th>
                    <th class="delivery-subcell">Day</th>
                    <th class="delivery-subcell">Year</th>
                    <th class="checkup-subcell">1st visit<br>Date</th>
                    <th class="checkup-subcell">2nd visit<br>Date</th>
                    <th class="checkup-subcell">3rd visit<br>Date</th>
                    <th class="checkup-subcell">4th visit<br>or more<br>Date</th>
                    <th class="outcome-subcell">Live Birth</th>
                    <th class="outcome-subcell">Preterm Birth</th>
                    <th class="outcome-subcell">Stillbirth</th>
                    <th class="outcome-subcell">Abortion</th>
                    <th class="prenatal-subcell">Day of Discharge/<br>24 hours after birth</th>
                    <th class="prenatal-subcell">Within 7 days after birth</th>
                  </tr>
                </thead>

                <!-- Data Rows -->
                <tbody>
                  <!-- First row with data -->
                  <tr class="data-row">
                    <td>1</td>
                    <td class="name-cell">${
                      patientType === 'new'
                        ? `${formData.firstname || ''} ${
                            formData.middlename || ''
                          } ${formData.lastname || ''}`.trim()
                        : 'Selected Patient'
                    }</td>
                    <td>${formData.age || ''}</td>
                    <td>${formData.gravidity || ''}</td>
                    <td>${formData.parity || ''}</td>
                    ${(() => {
                      if (formData.edc) {
                        const date = new Date(formData.edc);
                        const month = date.getMonth() + 1;
                        const day = date.getDate();
                        const year = date.getFullYear();
                        return `
                          <td>${month}</td>
                          <td>${day}</td>
                          <td>${year}</td>
                        `;
                      }
                      return `
                        <td></td>
                        <td></td>
                        <td></td>
                      `;
                    })()}
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>

                  <!-- Empty rows -->
                  ${[...Array(11)]
                    .map(
                      (_, index) => `
                  <tr class="empty-row">
                    <td>${index + 2}</td>
                    <td class="name-cell"></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>

              <!-- Bottom Information -->
              <div class="bottom-section">
                <div class="bottom-left">
                  <div class="info-row">
                    <span class="info-label">Name of BHW:</span>
                    <span class="info-value">${
                      formData.barangay_worker_id || ''
                    }</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Name of Midwife:</span>
                    <span class="info-value">${formData.midwife_id || ''}</span>
                  </div>
                </div>
                <div class="bottom-right">
                  <div class="info-row">
                    <span class="info-label">Barangay Health Station:</span>
                    <span class="info-value">${
                      formData.barangay_health_station || ''
                    }</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Rural Health Unit:</span>
                    <span class="info-value">${
                      formData.rural_health_unit || ''
                    }</span>
                  </div>
                </div>
              </div>
            </div>
          </body>
        </html>
      `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      // printWindow.close();
    }, 250);
  };

  return { handlePrint };
};

// Alternative hook-based approach
export const usePrintPdf = () => {
  const handlePrint = (formData, patientType) => {
    // Same implementation as above
    const printWindow = window.open('', '_blank');
    // ... rest of the implementation
  };

  return { handlePrint };
};
