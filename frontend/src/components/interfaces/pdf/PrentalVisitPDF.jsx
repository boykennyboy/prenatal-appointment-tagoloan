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
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
  },
  hospitalName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  hospitalSubtitle: {
    fontSize: 9,
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 25,
  },
  formCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 9,
    marginRight: 8,
    fontWeight: 'normal',
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    height: 12,
    marginRight: 15,
    paddingLeft: 2,
    justifyContent: 'flex-end',
  },
  dataText: {
    fontSize: 9,
    marginBottom: 1,
  },
  nameUnderline: {
    width: 150,
  },
  shortUnderline: {
    width: 80,
  },
  mediumUnderline: {
    width: 130,
  },
  longUnderline: {
    width: 180,
  },
  veryLongUnderline: {
    width: 250,
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkbox: {
    width: 12,
    height: 12,
    border: '1px solid black',
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxText: {
    fontSize: 8,
  },
  tableContainer: {
    marginTop: 10,
  },
  tableTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  table: {
    border: '2px solid black',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    minHeight: 25,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    minHeight: 20,
  },
  lastTableRow: {
    borderBottomWidth: 0,
  },
  labelCell: {
    width: 60,
    borderRightWidth: 1,
    borderRightColor: 'black',
    justifyContent: 'center',
    paddingLeft: 5,
  },
  trimesterHeaderCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  secondTrimesterHeaderCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  lastTrimesterHeaderCell: {
    flex: 2,
    borderRightWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  trimesterDataCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'black',
    flexDirection: 'row',
  },
  secondTrimesterDataCell: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: 'black',
    flexDirection: 'row',
  },
  lastTrimesterDataCell: {
    flex: 2,
    borderRightWidth: 0,
    flexDirection: 'row',
  },
  visitCell: {
    flex: 1,
    flexDirection: 'col',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: 'black',
    minHeight: 20,
    paddingLeft: 2,
    paddingTop: 2,
  },
  lastVisitCell: {
    borderRightWidth: 0,
  },
  cellText: {
    fontSize: 8,
    textAlign: 'left',
  },
  headerText: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: 'bold',
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
const PrenatalVisitPDF = ({ formData = {}, patientData = {} }) => {
  // Always convert formData into an array of visits
  const visitsArray = Array.isArray(formData) ? formData : [formData];

  const groupVisitsByTrimester = (visits) => {
    return visits.reduce(
      (acc, visit) => {
        switch (visit.pregnancy_status) {
          case 'first_trimester':
            acc.first.push(visit);
            break;
          case 'second_trimester':
            acc.second.push(visit);
            break;
          case 'third_trimester':
            acc.third.push(visit);
            break;
          default:
            // if pregnancy_status doesn't match, optionally put in "other"
            if (!acc.other) acc.other = [];
            acc.other.push(visit);
        }
        return acc;
      },
      { first: [], second: [], third: [] }
    );
  };

  const { first, second, third, other } = groupVisitsByTrimester(visitsArray);

  const renderVisitCells = (visits, maxCount, isLastTrimester = false) => {
    const cells = [];

    // Fill with actual visit data
    for (let i = 0; i < maxCount; i++) {
      const visit = visits[i];
      cells.push(
        <View
          key={i}
          style={[
            styles.visitCell,
            isLastTrimester && i === maxCount - 1 ? styles.lastVisitCell : {},
          ]}
        >
          {visit && <Text style={styles.cellText}>{visit.value || ''}</Text>}
        </View>
      );
    }

    return cells;
  };

  const renderDataRow = (label, dataKey, isLast = false) => {
    // Extract data for each trimester
    const firstTrimesterData = first.map((visit) => ({
      value: visit[dataKey] || '',
    }));
    const secondTrimesterData = second.map((visit) => ({
      value: visit[dataKey] || '',
    }));
    const thirdTrimesterData = third.map((visit) => ({
      value: visit[dataKey] || '',
    }));

    return (
      <View style={[styles.tableRow, isLast && styles.lastTableRow]}>
        <View style={styles.labelCell}>
          <Text style={styles.cellText}>{label}</Text>
        </View>
        <View style={styles.trimesterDataCell}>
          {renderVisitCells(firstTrimesterData, 2)}
        </View>
        <View style={styles.secondTrimesterDataCell}>
          {renderVisitCells(secondTrimesterData, 2)}
        </View>
        <View style={styles.lastTrimesterDataCell}>
          {renderVisitCells(thirdTrimesterData, 4, true)}
        </View>
      </View>
    );
  };

  // Get patient info from the first record or patientData
  const patient = visitsArray[0] || patientData;
  const fullAddress = `${patient.barangay || ''} ${
    patient.municipality || ''
  } ${patient.province || ''}`.trim();

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.hospitalName}>SAINT PAUL HOSPITAL</Text>
          <Text style={styles.hospitalSubtitle}>
            TAGOLOAN, MISAMIS ORIENTAL
          </Text>
        </View>

        {/* Patient Information Form */}
        <View style={styles.formSection}>
          {/* Name Row */}
          <View style={styles.formRow}>
            <Text style={styles.label}>NAME:</Text>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.nameUnderline]}>
                <Text style={styles.dataText}>{patient.lastname || ''}</Text>
              </View>
              <Text style={styles.label}>APELLIDO</Text>
            </View>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.nameUnderline]}>
                <Text style={styles.dataText}>{patient.firstname || ''}</Text>
              </View>
              <Text style={styles.label}>PANGALAN</Text>
            </View>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.nameUnderline]}>
                <Text style={styles.dataText}>{patient.middlename || ''}</Text>
              </View>
              <Text style={styles.label}>MIDDLE NAME</Text>
            </View>
          </View>

          {/* Age, DOB, Contact Row */}
          <View style={styles.formRow}>
            <Text style={styles.label}>AGE:</Text>
            <View style={[styles.underline, styles.shortUnderline]}>
              <Text style={styles.dataText}>{patient.age || ''}</Text>
            </View>
            <Text style={styles.label}>DATE OF BIRTH:</Text>
            <View style={[styles.underline, styles.mediumUnderline]}>
              <Text style={styles.dataText}>{patient.birth_date || ''}</Text>
            </View>
            <Text style={styles.label}>CONTACT NO:</Text>
            <View style={[styles.underline, styles.mediumUnderline]}>
              <Text style={styles.dataText}>{patient.contact || ''}</Text>
            </View>
          </View>

          {/* Address Row */}
          <View style={styles.formRow}>
            <Text style={styles.label}>ADDRESS:</Text>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.shortUnderline]}>
                <Text style={styles.dataText}>{patient.zone || ''}</Text>
              </View>
              <Text style={styles.label}>ZONE/PUROK</Text>
            </View>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.mediumUnderline]}>
                <Text style={styles.dataText}>{patient.barangay || ''}</Text>
              </View>
              <Text style={styles.label}>BARANGAY</Text>
            </View>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.mediumUnderline]}>
                <Text style={styles.dataText}>
                  {patient.municipality || ''}
                </Text>
              </View>
              <Text style={styles.label}>MUNICIPALITY</Text>
            </View>
            <View style={styles.formCol}>
              <View style={[styles.underline, styles.mediumUnderline]}>
                <Text style={styles.dataText}>{patient.province || ''}</Text>
              </View>
              <Text style={styles.label}>PROVINCE</Text>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.formRow}>
            <Text style={styles.label}>
              CONTACT PERSON IN CASE OF EMERGENCY:
            </Text>
            <View style={[styles.underline, styles.veryLongUnderline]}>
              <Text style={styles.dataText}>
                {patient.contact_person_name || ''}
              </Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>CONTACT NO:</Text>
            <View style={[styles.underline, styles.longUnderline]}>
              <Text style={styles.dataText}>
                {patient.contact_person_number || ''}
              </Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>RELATIONSHIP:</Text>
            <View style={[styles.underline, styles.longUnderline]}>
              <Text style={styles.dataText}>
                {patient.contact_person_relationship || ''}
              </Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>ATTENDING PHYSICIAN:</Text>
            <View style={[styles.underline, styles.longUnderline]}>
              <Text style={styles.dataText}>{patient.doctor_name || ''}</Text>
            </View>
          </View>

          {/* Checkboxes G T P A L */}
          <View style={styles.checkboxRow}>
            <View style={styles.checkboxItem}>
              <Text style={styles.label}>G</Text>
              <View style={styles.checkbox}>
                <Text style={styles.checkboxText}>
                  {patient.gravidity || ''}
                </Text>
              </View>
            </View>
            <View style={styles.checkboxItem}>
              <Text style={styles.label}>T</Text>
              <View style={styles.checkbox}>
                <Text style={styles.checkboxText}>{patient.term || ''}</Text>
              </View>
            </View>
            <View style={styles.checkboxItem}>
              <Text style={styles.label}>P</Text>
              <View style={styles.checkbox}>
                <Text style={styles.checkboxText}>{patient.preterm || ''}</Text>
              </View>
            </View>
            <View style={styles.checkboxItem}>
              <Text style={styles.label}>A</Text>
              <View style={styles.checkbox}>
                <Text style={styles.checkboxText}>
                  {patient.abortion || ''}
                </Text>
              </View>
            </View>
            <View style={styles.checkboxItem}>
              <Text style={styles.label}>L</Text>
              <View style={styles.checkbox}>
                <Text style={styles.checkboxText}>
                  {patient.living_children || ''}
                </Text>
              </View>
            </View>
          </View>

          {/* LMP and EDC */}
          <View style={styles.formRow}>
            <Text style={styles.label}>LMP:</Text>
            <View style={[styles.underline, styles.mediumUnderline]}>
              <Text style={styles.dataText}>{patient.lmp || ''}</Text>
            </View>
          </View>

          <View style={styles.formRow}>
            <Text style={styles.label}>EDC:</Text>
            <View style={[styles.underline, styles.mediumUnderline]}>
              <Text style={styles.dataText}>{patient.edc || ''}</Text>
            </View>
          </View>
        </View>

        {/* Prenatal Visits Table */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>PRENATAL VISITS</Text>

          <View style={styles.table}>
            {/* Table Headers */}
            <View style={styles.tableHeaderRow}>
              <View style={styles.labelCell}>
                <Text style={styles.headerText}></Text>
              </View>
              <View style={styles.trimesterHeaderCell}>
                <Text style={styles.headerText}>1st</Text>
                <Text style={styles.headerText}>TRIMESTER</Text>
              </View>
              <View style={styles.secondTrimesterHeaderCell}>
                <Text style={styles.headerText}>2nd</Text>
                <Text style={styles.headerText}>TRIMESTER</Text>
              </View>
              <View style={styles.lastTrimesterHeaderCell}>
                <Text style={styles.headerText}>3rd</Text>
                <Text style={styles.headerText}>TRIMESTER</Text>
              </View>
            </View>

            {/* Data Rows */}
            {renderDataRow('DATE', 'date')}
            {renderDataRow('WEIGHT', 'weight')}
            {renderDataRow('B/P', 'bp')}
            {renderDataRow('TEMP.', 'temp')}
            {renderDataRow('RR', 'rr')}
            {renderDataRow('PR', 'pr')}
            {renderDataRow('O2 SAT', 'two_sat')}
            {renderDataRow('F.H.T', 'fht')}
            {renderDataRow('FH', 'fh')}
            {renderDataRow('AOG', 'aog', true)}
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

export default PrenatalVisitPDF;
