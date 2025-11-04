import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
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
  location: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: '#E0E0E0',
    marginLeft: 10,
    borderRadius: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  formSection: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: 5,
    width: 100,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    flex: 1,
    height: 12,
    marginRight: 15,
  },
  shortUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
    width: 80,
    height: 12,
    marginRight: 10,
  },
  vitalSignsTable: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    flex: 1,
  },
  tableCell: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    fontSize: 9,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderStyle: 'solid',
    flex: 1,
    height: 25,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  commentsSection: {
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'solid',
    height: 300,
    marginTop: 20,
    position: 'relative',
  },
  commentsTitle: {
    position: 'absolute',
    top: -8,
    left: 10,
    backgroundColor: '#FFFFFF',
    padding: '0 5',
    fontSize: 12,
    color: '#000000',
    fontWeight: 'bold',
  },
  flexCol: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  nameUnderline: {
    width: 150,
  },
  dataText: {
    fontSize: 9,
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-CA', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
};
// PDF Document Component
const OutPatientPDF = ({ formData = {} }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.hospitalName}>SAINT PAUL HOSPITAL</Text>
        <Text style={styles.hospitalSubtitle}>TAGOLOAN, MISAMIS ORIENTAL</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>OUT-PATIENT RECORD SHEET</Text>

      {/* Patient Information */}
      <View style={styles.formSection}>
        <View style={[styles.formRow, { marginBottom: 50, width: 300 }]}>
          <Text style={[styles.label, { width: 80 }]}>FILE NUMBER</Text>
          <View style={[styles.underline, styles.nameUnderline]}>
            <Text style={styles.dataText}>{formData.file_number || ''}</Text>
          </View>
        </View>

        <View style={[styles.formRow, { marginBottom: 20 }]}>
          <Text style={[styles.label, { marginTop: -15 }]}>
            NAME OF PATIENT
          </Text>
          <View style={styles.formCol}>
            <View style={[styles.underline, styles.nameUnderline]}>
              <Text style={[styles.dataText, { marginTop: -12 }]}>
                {formData.lastname || ''}
              </Text>
            </View>
            <Text style={styles.label}>APELLIDO</Text>
          </View>
          <View style={styles.formCol}>
            <View style={[styles.underline, styles.nameUnderline]}>
              <Text style={[styles.dataText, { marginTop: -12 }]}>
                {formData.firstname || ''}
              </Text>
            </View>
            <Text style={styles.label}>PANGALAN</Text>
          </View>
          <View style={styles.formCol}>
            <View style={[styles.underline, styles.nameUnderline]}>
              <Text style={[styles.dataText, { marginTop: -12 }]}>
                {formData.middlename || ''}
              </Text>
            </View>
            <Text style={styles.label}>MIDDLE NAME</Text>
          </View>
        </View>

        <View style={[styles.formRow, { marginBottom: 20 }]}>
          <Text style={[styles.label, { width: 40 }]}>AGE/SEX</Text>
          <View style={[styles.underline, styles.shortUnderline]}>
            <Text style={styles.dataText}>{`${formData.age || ''}/${
              formData.sex || ''
            }`}</Text>
          </View>
          <Text style={[styles.label, { width: 60 }]}>BIRTHDATE</Text>
          <View style={[styles.underline, styles.shortUnderline]}>
            <Text style={styles.dataText}>
              {formatDate(formData.birth_date) || ''}
            </Text>
          </View>
          <Text style={[styles.label, { width: 50 }]}>RELIGION</Text>
          <View style={[styles.underline, styles.shortUnderline]}>
            <Text style={styles.dataText}>{formData.religion || ''}</Text>
          </View>
        </View>

        <View style={[styles.formRow, { marginBottom: 20 }]}>
          <Text style={[styles.label, { width: 60 }]}>ADDRESS</Text>
          <View style={styles.underline}>
            <Text style={styles.dataText}>{`${formData.zone || ''} ${
              formData.full_address || ''
            }`}</Text>
          </View>
          <Text style={[styles.label, { width: 80 }]}>PLACE OF BIRTH</Text>
          <View style={[styles.underline, styles.shortUnderline]}>
            <Text style={styles.dataText}>{formData.birth_place || ''}</Text>
          </View>
        </View>

        <View style={[styles.formRow, { marginBottom: 20 }]}>
          <Text style={[styles.label, { width: 200 }]}>
            IN CASE OF EMERGENCY CONTACT PERSON
          </Text>
          <View style={styles.underline}>
            <Text style={styles.dataText}>
              {formData.contact_person_name || ''}
            </Text>
          </View>
        </View>

        <View style={[styles.formRow, { marginBottom: 20 }]}>
          <Text style={[styles.label, { width: 115 }]}>
            ATTENDING PHYSICIAN
          </Text>
          <View style={styles.underline}>
            <Text style={styles.dataText}>
              {formData.attending_physician || ''}
            </Text>
          </View>
          <Text style={[styles.label, { width: 40 }]}>PHIC</Text>
          <View style={styles.shortUnderline}>
            <Text style={styles.dataText}>{formData.phic || ''}</Text>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={[styles.label, { width: 115 }]}>CHIEF COMPLAINT</Text>
          <View style={styles.underline}>
            <Text style={styles.dataText}>{formData.chief_complain || ''}</Text>
          </View>
        </View>
      </View>

      {/* Vital Signs Table */}
      <View style={styles.vitalSignsTable}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>DATE</Text>
          <Text style={styles.tableHeader}>TIME</Text>
          <Text style={styles.tableHeader}>WEIGHT</Text>
          <Text style={styles.tableHeader}>HEIGHT</Text>
          <Text style={styles.tableHeader}>TEMP</Text>
          <Text style={styles.tableHeader}>RR</Text>
          <Text style={styles.tableHeader}>PR</Text>
          <Text style={styles.tableHeader}>02 SAT</Text>
          <Text style={[styles.tableHeader, styles.lastCell]}>BP</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>
            {formatDate(formData.date) || ''}
          </Text>
          <Text style={styles.tableCell}>{formData.time || ''}</Text>
          <Text style={styles.tableCell}>{formData.weight || ''}</Text>
          <Text style={styles.tableCell}>{formData.height || ''}</Text>
          <Text style={styles.tableCell}>{formData.temp || ''}</Text>
          <Text style={styles.tableCell}>{formData.rr || ''}</Text>
          <Text style={styles.tableCell}>{formData.pr || ''}</Text>
          <Text style={styles.tableCell}>{formData.two_sat || ''}</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>
            {formData.bp || ''}
          </Text>
        </View>
      </View>

      {/* Comments Section */}
      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments</Text>
      </View>
      {/* Footer */}
      <View style={styles.footer}>
        <Text>Online Prenatal Appointment System</Text>
        <Text>{today}</Text>
      </View>
    </Page>
  </Document>
);

export default OutPatientPDF;
