import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 36,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subTitle: {
    display: 'flex',
    justifyContent: 'center',
    gap: 16,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    fontSize: 10,
  },
  infoColumn: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
    alignItems: 'center',
  },
  infoLabel: {
    minWidth: 80,
    marginRight: 5,
    fontSize: 9,
  },
  infoValue: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    flex: 1,
    paddingHorizontal: 3,
    minHeight: 10,
    paddingBottom: 1,
    fontSize: 9,
  },
  mainTable: {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    fontSize: 9,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  tableSubHeaderRow: {
    flexDirection: 'row',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: 25,
  },
  emptyTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: 22,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
    padding: 2,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
    padding: 2,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    fontSize: 8,
    fontWeight: 'bold',
  },
  nameCell: {
    textAlign: 'left',
    paddingLeft: 5,
  },
  // Fixed column widths for perfect alignment
  noCell: { width: 25 },
  nameCellWidth: { width: 100 },
  ageCell: { width: 35 },
  gravidityCell: { width: 90 },
  parityCell: { width: 40 },
  lmpCell: { width: 90 },
  contactCell: { width: 110 },
  edcCell: { width: 90 },
  checkupCell: { width: 30 },
  checkupCell2: { width: 35 },
  checkupCell3: { width: 160 },
  outcomeCell: { width: 50 },
  prenatalCell: { width: 60 },
  bottomSection: {
    width: '100%',
    paddingTop: 5,
  },
  legendRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  legendColumn: {
    flex: 1,
    paddingRight: 10,
    paddingLeft: 5,
  },
  infoLabel2: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoValue2: {
    fontSize: 8,
    lineHeight: 1.2,
    marginBottom: 1,
  },
  multiLine: {
    fontSize: 7,
    lineHeight: 1.0,
  },
  riskCodeText: {
    fontSize: 7,
    marginBottom: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 9,
    color: '#555',
    borderTop: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
const today = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: '2-digit',
  year: 'numeric',
});
const PregnancyTrackingPDF = ({ formData, patientType }) => {
  const currentYear = new Date().getFullYear();

  const getPatientName = () => {
    return formData.fullname;
  };

  const getEDCValues = () => {
    if (formData.edc) {
      const date = new Date(formData.edc);

      return {
        month: date.getMonth() + 1,
        day: date.getDate(),
        year: date.getFullYear(),
      };
    }
    return { month: '', day: '', year: '' };
  };

  const edc = getEDCValues();

  // Function to format risk codes for display
  const formatRiskCodes = () => {
    if (!formData.risk_codes || formData.risk_codes.length === 0) {
      return '';
    }

    return formData.risk_codes
      .map((risk, index) => {
        let riskText = risk.risk_code || '';
        if (risk.risk_status) {
          riskText += ` - ${risk.risk_status}`;
        }
        if (risk.date_detected) {
          riskText += `\nDate: ${risk.date_detected}`;
        }
        return riskText;
      })
      .join('\n\n');
  };

  return (
    <Document>
      <Page size='A4' orientation='landscape' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PREGNANCY TRACKING FORM</Text>
          <Text style={styles.headerSubtitle}>
            Month:{'  '}
            {new Date(formData.created_at).toLocaleString('default', {
              month: 'long',
            })}
            {'  '}
            {new Date(formData.created_at).getFullYear()}
          </Text>
        </View>

        {/* Top Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Barangay:</Text>
              <Text style={styles.infoValue}>
                {formData.center_barangay || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Municipality:</Text>
              <Text style={styles.infoValue}>
                {formData.center_municipality || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Province:</Text>
              <Text style={styles.infoValue}>
                {formData.center_province || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Referral Unit:</Text>
              <Text style={styles.infoValue}>
                {formData.referral_unit || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>BEMOC:</Text>
              <Text style={styles.infoValue}>{formData.bemoc || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {formData.bemoc_address || ''}
              </Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>CEMOC:</Text>
              <Text style={styles.infoValue}>{formData.cemoc || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {formData.cemoc_address || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name of Midwife:</Text>
              <Text style={styles.infoValue}>
                {formData.midwife_name || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Duty Station & Address:</Text>
              <Text style={styles.infoValue}>
                {`${formData.health_station} - ${formData.barangay}` || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>HRH In-charge</Text>
              <Text style={styles.infoValue}>{formData.nurse_name || ''}</Text>
            </View>
          </View>
        </View>

        {/* Main Table */}
        <View style={styles.mainTable}>
          {/* Table Header - First Row */}
          <View style={[styles.tableHeaderRow, styles.tableHeader]}>
            <View style={[styles.headerCell, styles.noCell]}>
              <Text>No.</Text>
            </View>
            <View style={[styles.headerCell, styles.nameCellWidth]}>
              <Text>Name</Text>
            </View>
            <View style={[styles.headerCell, styles.gravidityCell]}>
              <Text>Address</Text>
            </View>
            <View style={[styles.headerCell, styles.gravidityCell]}>
              <Text>Date of Birth</Text>
            </View>
            <View style={[styles.headerCell, styles.ageCell]}>
              <Text>Age</Text>
            </View>
            <View style={[styles.headerCell, styles.contactCell]}>
              <Text>Contact</Text>
            </View>
            <View style={[styles.headerCell, styles.lmpCell]}>
              <Text>LMP</Text>
            </View>
            <View style={[styles.headerCell, { width: 90 }]}>
              <Text>EDC</Text>
            </View>
            <View style={[styles.headerCell, { width: 90 }]}>
              <Text>Parity (Gravida, Para)</Text>
            </View>
            <View style={[styles.headerCell, { width: 70 }]}>
              <Text>4 ANC Given</Text>
            </View>
            <View style={[styles.headerCell, { width: 160 }]}>
              <Text>Risk Code & Date Detected</Text>
            </View>
            <View style={[styles.headerCell, styles.lmpCell]}>
              <Text>Date Terminated/Delivery</Text>
            </View>
            <View style={[styles.headerCell, { width: 60 }]}>
              <Text>Outcome Sex & Weight</Text>
            </View>
            <View style={[styles.headerCell, { width: 130 }]}>
              <Text>Place of Delivery & Attended By</Text>
            </View>
            <View style={[styles.headerCell, { width: 40 }]}>
              <Text>PHIC</Text>
            </View>
          </View>

          {/* Table Header - Second Row */}
          <View style={[styles.tableSubHeaderRow, styles.tableHeader]}>
            {/* Empty cells for first 5 columns */}
            <View
              style={[
                styles.headerCell,
                styles.noCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.nameCellWidth,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.gravidityCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.gravidityCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.ageCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.contactCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.lmpCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />

            <View
              style={[
                styles.headerCell,
                styles.edcCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />

            {/* Parity Gravida Para Sub headers */}
            <View
              style={[
                styles.headerCell,
                styles.checkupCell,
                { borderBottom: 1 },
              ]}
            ></View>
            <View
              style={[
                styles.headerCell,
                styles.checkupCell,
                { borderBottom: 1 },
              ]}
            ></View>
            <View
              style={[
                styles.headerCell,
                styles.checkupCell,
                { borderBottom: 1 },
              ]}
            ></View>

            {/* Antenatal Care sub-headers */}
            <View
              style={[
                styles.headerCell,
                styles.checkupCell2,
                { borderBottom: 1 },
              ]}
            >
              <Text>Yes</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.checkupCell2,
                { borderBottom: 1 },
              ]}
            >
              <Text>No</Text>
            </View>

            {/* Risk Code & Date Detected */}
            <View
              style={[
                styles.headerCell,
                styles.checkupCell3,
                { borderBottom: 1 },
              ]}
            ></View>

            <View
              style={[
                styles.headerCell,
                styles.lmpCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  width: 60,
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  width: 65,
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  width: 65,
                  borderBottom: 1,
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                {
                  backgroundColor: 'transparent',
                  borderRightColor: 'transparent',
                  width: 40,
                  borderBottom: 1,
                },
              ]}
            />
          </View>

          {/* Data Rows - First row and additional rows for each risk code */}
          {Array.from({
            length: Math.max(1, formData.risk_codes?.length || 1),
          }).map((_, dataRowIndex) => {
            const isFirstRow = dataRowIndex === 0;
            const currentRisk = formData.risk_codes?.[dataRowIndex] || null;

            return (
              <View key={`data-row-${dataRowIndex}`} style={styles.tableRow}>
                <View style={[styles.cell, styles.noCell]}>
                  <Text>{isFirstRow ? '1' : ''}</Text>
                </View>
                <View
                  style={[styles.cell, styles.nameCellWidth, styles.nameCell]}
                >
                  <Text>{isFirstRow ? getPatientName() : ''}</Text>
                </View>
                <View style={[styles.cell, styles.gravidityCell]}>
                  <Text>
                    {isFirstRow ? formData.patient_short_address || '' : ''}
                  </Text>
                </View>
                <View style={[styles.cell, styles.gravidityCell]}>
                  <Text>{isFirstRow ? formData.birth_date || '' : ''}</Text>
                </View>
                <View style={[styles.cell, styles.ageCell]}>
                  <Text>{isFirstRow ? formData.age || '' : ''}</Text>
                </View>
                <View style={[styles.cell, styles.contactCell]}>
                  <Text>
                    {isFirstRow
                      ? formData.contact && formData.contact.startsWith('63')
                        ? `0${formData.contact.slice(2)}`
                        : formData.contact || ''
                      : ''}
                  </Text>
                </View>
                <View style={[styles.cell, styles.lmpCell]}>
                  <Text>{isFirstRow ? formData.lmp || '' : ''}</Text>
                </View>
                <View style={[styles.cell, styles.edcCell]}>
                  <Text>{isFirstRow ? formData.edc || '' : ''}</Text>
                </View>

                {/* Antenatal Care columns */}
                <View style={[styles.cell, styles.checkupCell]}>
                  <Text>
                    {isFirstRow ? `G${formData.gravidity || '-'}` : ''}
                  </Text>
                </View>
                <View style={[styles.cell, styles.checkupCell]}>
                  <Text>{isFirstRow ? `P${formData.parity || '-'}` : ''}</Text>
                </View>
                <View style={[styles.cell, styles.checkupCell]}>
                  <Text>
                    {isFirstRow ? `A${formData.abortion || '-'}` : ''}
                  </Text>
                </View>

                {/* 4 ANC Given columns */}
                <View style={[styles.cell, styles.checkupCell2]}>
                  <Text>
                    {isFirstRow ? (formData?.anc_given ? '/' : '') : ''}
                  </Text>
                </View>
                <View style={[styles.cell, styles.checkupCell2]}>
                  <Text></Text>
                </View>

                {/* Risk Code and Date Detected column - One risk code per row */}
                <View
                  style={[
                    styles.cell,
                    styles.checkupCell3,
                    {
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      paddingTop: 3,
                    },
                  ]}
                >
                  {currentRisk ? (
                    <View>
                      <Text style={styles.riskCodeText}>
                        {currentRisk.risk_code || ''}
                      </Text>
                      {currentRisk.risk_status && (
                        <Text style={styles.riskCodeText}>
                          - {currentRisk.risk_status}
                        </Text>
                      )}
                      {currentRisk.date_detected && (
                        <Text style={styles.riskCodeText}>
                          Date: {currentRisk.date_detected}
                        </Text>
                      )}
                    </View>
                  ) : (
                    <Text></Text>
                  )}
                </View>

                {/* Date Terminated/Delivery */}
                <View style={[styles.cell, styles.lmpCell]}>
                  <Text>{isFirstRow ? formData?.date_delivery || '' : ''}</Text>
                </View>

                {/* Outcome Sex and Weight */}
                <View style={[styles.cell, { width: 60 }]}>
                  <Text>
                    {isFirstRow
                      ? formData?.outcome_sex && formData?.outcome_weight
                        ? `${formData.outcome_sex.slice(0, 1).toUpperCase()}/${
                            formData.outcome_weight
                          } kg`
                        : ''
                      : ''}
                  </Text>
                </View>

                {/* Place of delivery and attended by */}
                <View style={[styles.cell, { width: 65 }]}>
                  <Text>
                    {isFirstRow ? formData?.place_of_delivery || '' : ''}
                  </Text>
                </View>

                <View style={[styles.cell, { width: 65 }]}>
                  <Text>{isFirstRow ? formData?.doctor_name || '' : ''}</Text>
                </View>

                {/* PHIC */}
                <View style={[styles.cell, { width: 40 }]}>
                  <Text>
                    {isFirstRow ? (formData?.phic ? 'Yes' : 'No') : ''}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Empty Rows - Adjust count based on risk codes */}
          {formData.risk_codes?.length < 1 &&
            Array.from({
              length: Math.max(
                0,
                formData.risk_codes?.length ??
                  8 - Math.max(1, formData.risk_codes?.length || 1)
              ),
            }).map((_, rowIndex) => {
              const actualRowNumber =
                Math.max(1, formData.risk_codes?.length || 1) + rowIndex + 1;

              return (
                <View key={`empty-${rowIndex}`} style={styles.emptyTableRow}>
                  <View style={[styles.cell, styles.noCell]}>
                    <Text>{actualRowNumber}</Text>
                  </View>
                  <View
                    style={[styles.cell, styles.nameCellWidth, styles.nameCell]}
                  >
                    <Text></Text>
                  </View>
                  <View style={[styles.cell, styles.gravidityCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.cell, styles.gravidityCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.cell, styles.ageCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.cell, styles.contactCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.cell, styles.lmpCell]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.cell, styles.edcCell]}>
                    <Text></Text>
                  </View>

                  {/* Antenatal Care empty columns */}
                  {Array.from({ length: 3 }).map((_, index) => (
                    <View
                      key={`empty-checkup-${index}`}
                      style={[styles.cell, styles.checkupCell]}
                    >
                      <Text></Text>
                    </View>
                  ))}

                  {/* 4 ANC Given empty columns */}
                  {Array.from({ length: 2 }).map((_, index) => (
                    <View
                      key={`empty-outcome-${index}`}
                      style={[styles.cell, styles.checkupCell2]}
                    >
                      <Text></Text>
                    </View>
                  ))}

                  {/* Risk Code and Date Detected empty columns */}
                  <View style={[styles.cell, styles.checkupCell3]}>
                    <Text></Text>
                  </View>

                  {/* Date Terminated/Delivery */}
                  <View style={[styles.cell, styles.lmpCell]}>
                    <Text></Text>
                  </View>

                  {/* Outcome Sex and Weight */}
                  <View style={[styles.cell, { width: 60 }]}>
                    <Text></Text>
                  </View>

                  {/* Place of delivery and attended by */}
                  <View style={[styles.cell, { width: 65 }]}>
                    <Text></Text>
                  </View>

                  <View style={[styles.cell, { width: 65 }]}>
                    <Text></Text>
                  </View>

                  {/* PHIC */}
                  <View style={[styles.cell, { width: 40 }]}>
                    <Text></Text>
                  </View>
                </View>
              );
            })}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Single row with multiple columns */}
          <View style={styles.legendRow}>
            {/* First Column - Risk Code A,B,C,D */}
            <View style={styles.legendColumn}>
              <Text style={styles.infoLabel2}>Risk Code:</Text>
              <Text style={styles.infoValue2}>
                A = an age less than 18 years old
              </Text>
              <Text style={styles.infoValue2}>
                B = an age more than 35 years old
              </Text>
              <Text style={styles.infoValue2}>
                C = being less than 145 cm (4'9) tall
              </Text>
              <Text style={styles.infoValue2}>
                D = having fourth or more baby or so called grandmulti
              </Text>
            </View>

            {/* Second Column - Risk Code E */}
            <View style={styles.legendColumn}>
              <Text style={styles.infoLabel2}></Text>
              <Text style={styles.infoValue2}>
                E = having one or more of the ff:
              </Text>
              <Text style={styles.infoValue2}>
                (a) a previous caesarean section
              </Text>
              <Text style={styles.infoValue2}>
                (b) 3 consecutive miscarriages or stillborn baby
              </Text>
              <Text style={styles.infoValue2}>(c) postpartum hemorrhage</Text>
            </View>

            {/* Third Column - Risk Code F */}
            <View style={styles.legendColumn}>
              <Text style={styles.infoLabel2}></Text>
              <Text style={styles.infoValue2}>
                F = having one or more of the ff:
              </Text>
              <Text style={styles.infoValue2}>
                (1) Tuberculosis (2) Heart Disease
              </Text>
              <Text style={styles.infoValue2}>
                (3) Diabetes (4) Bronchial Asthma
              </Text>
              <Text style={styles.infoValue2}>(5) Goiter</Text>
            </View>

            {/* Fourth Column - Outcome */}
            <View style={styles.legendColumn}>
              <Text style={styles.infoLabel2}>Outcome:</Text>
              <Text style={styles.infoValue2}>LB = Live Birth</Text>
              <Text style={styles.infoValue2}>SB = Still Birth</Text>
              <Text style={styles.infoValue2}>AB = Abortion</Text>
            </View>

            {/* Fifth Column - Attendant */}
            <View style={styles.legendColumn}>
              <Text style={styles.infoLabel2}>Attendant:</Text>
              <Text style={styles.infoValue2}>A = Doctor</Text>
              <Text style={styles.infoValue2}>B = Nurse</Text>
              <Text style={styles.infoValue2}>C = Midwife</Text>
              <Text style={styles.infoValue2}>D = Hilot/TBA</Text>
              <Text style={styles.infoValue2}>E = Others</Text>
            </View>
          </View>
        </View>
        {/* Footer */}
        <View style={styles.footer}>
          <Text>Online Prenatal Appointment System</Text>
          <Text>{today}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PregnancyTrackingPDF;
