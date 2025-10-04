import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from '@react-pdf/renderer';

// Form data structure
export const immunizationFormData = {
  patient_id: '',
  tetanus_first_given: new Date().toLocaleDateString('en-CA'),
  tetanus_second_given: '',
  tetanus_third_given: '',
  tetanus_fourth_given: '',
  tetanus_fifth_given: '',
  tetanus_first_comeback: '',
  tetanus_second_comeback: '',
  tetanus_third_comeback: '',
  tetanus_fourth_comeback: '',
  tetanus_fifth_comeback: '',
  covid_first_given: '',
  covid_second_given: '',
  covid_booster_given: '',
  covid_first_comeback: '',
  covid_second_comeback: '',
  covid_booster_comeback: '',
  other_vaccine_name: '',
  other_first_given: '',
  other_second_given: '',
  other_third_given: '',
  other_fourth_given: '',
  other_fifth_given: '',
  other_first_comeback: '',
  other_second_comeback: '',
  other_third_comeback: '',
  other_fourth_comeback: '',
  other_fifth_comeback: '',
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#000000',
    paddingBottom: 10,
    justifyContent: 'center',
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  location: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
    backgroundColor: '#E0E0E0',
    padding: 8,
    borderWidth: 1,
    borderColor: '#000000',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderBottomColor: '#000000',
    minHeight: 25,
  },
  lastRow: {
    borderBottom: 0,
  },
  vaccineNameCell: {
    width: '40%',
    padding: 6,
    borderRight: 1,
    borderRightColor: '#000000',
    fontSize: 10,
    fontWeight: 'bold',
    justifyContent: 'center',
  },
  dataCell: {
    width: '30%',
    padding: 6,
    borderRight: 1,
    borderRightColor: '#000000',
    fontSize: 9,
    justifyContent: 'center',
  },
  lastCell: {
    borderRight: 0,
    width: '30%',
  },
  headerRow: {
    backgroundColor: '#F0F0F0',
    fontWeight: 'bold',
  },
  headerCell: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    backgroundColor: '#D0D0D0',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  doseRow: {
    fontSize: 9,
    paddingLeft: 15,
  },
  fullyImmunized: {
    backgroundColor: '#E8E8E8',
    fontSize: 9,
    fontWeight: 'bold',
    paddingLeft: 15,
  },
  otherVaccineInput: {
    borderBottom: 1,
    borderBottomColor: '#000000',
    minHeight: 15,
    paddingLeft: 5,
  },
});

// PDF Document Component
const ImmunizationPDF = ({ formData = {} }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hospitalName}>ST. PAUL HOSPITAL</Text>
          <Text style={styles.location}>Tagoloan, Misamis Oriental</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>IMMUNIZATION RECORD</Text>

      {/* Main Table */}
      <View style={styles.table}>
        {/* Table Headers */}
        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={[styles.vaccineNameCell, styles.headerCell]}></Text>
          <Text style={[styles.dataCell, styles.headerCell]}>DATE GIVEN</Text>
          <Text style={[styles.dataCell, styles.headerCell, styles.lastCell]}>
            DATE TO COMEBACK
          </Text>
        </View>

        {/* TETANUS Section */}
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.sectionHeader]}>
            TETANUS - CONTAINING VACCINE
          </Text>
          <Text style={styles.dataCell}></Text>
          <Text style={[styles.dataCell, styles.lastCell]}></Text>
        </View>

        {/* Tetanus Doses */}
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>1st DOSE</Text>
          <Text style={styles.dataCell}>{formData.tetanus_first_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.tetanus_first_comeback}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>2nd DOSE</Text>
          <Text style={styles.dataCell}>{formData.tetanus_second_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.tetanus_second_comeback}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>3rd DOSE</Text>
          <Text style={styles.dataCell}>{formData.tetanus_third_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.tetanus_third_comeback}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>4th DOSE</Text>
          <Text style={styles.dataCell}>{formData.tetanus_fourth_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.tetanus_fourth_comeback}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>5th DOSE</Text>
          <Text style={styles.dataCell}>{formData.tetanus_fifth_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.tetanus_fifth_comeback}
          </Text>
        </View>

        {/* Fully Immunized Row */}
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.fullyImmunized]}>
            FULLY IMMUNIZED
          </Text>
          <Text style={styles.dataCell}></Text>
          <Text style={[styles.dataCell, styles.lastCell]}></Text>
        </View>

        {/* COVID-19 Section */}
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.sectionHeader]}>
            COVID - 19 VACCINE
          </Text>
          <Text style={styles.dataCell}></Text>
          <Text style={[styles.dataCell, styles.lastCell]}></Text>
        </View>

        {/* COVID Doses */}
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>1st DOSE</Text>
          <Text style={styles.dataCell}>{formData.covid_first_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.covid_first_comeback}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>2nd DOSE</Text>
          <Text style={styles.dataCell}>{formData.covid_second_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.covid_second_comeback}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>BOOSTER</Text>
          <Text style={styles.dataCell}>{formData.covid_booster_given}</Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.covid_booster_comeback}
          </Text>
        </View>

        {/* OTHERS Section */}
        <View style={styles.tableRow}>
          <Text style={[styles.vaccineNameCell, styles.sectionHeader]}>
            OTHERS:
          </Text>
          <Text style={styles.dataCell}></Text>
          <Text style={[styles.dataCell, styles.lastCell]}></Text>
        </View>

        {/* Other Vaccine Rows */}
        <View style={styles.tableRow}>
          <View
            style={[
              styles.vaccineNameCell,
              styles.doseRow,
              {
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
              },
            ]}
          >
            <Text style={{ marginRight: 5 }}>1.</Text>
            <View style={styles.otherVaccineInput}>
              <Text style={{ fontSize: 9 }}>
                {formData.other_vaccine_name || ''}
              </Text>
            </View>
          </View>
          <Text style={styles.dataCell}>
            {formData.other_first_given || ''}
          </Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.other_first_comeback || ''}
          </Text>
        </View>
        <View style={[styles.tableRow, styles.lastRow]}>
          <Text style={[styles.vaccineNameCell, styles.doseRow]}>2.</Text>
          <Text style={styles.dataCell}>
            {formData.other_second_given || ''}
          </Text>
          <Text style={[styles.dataCell, styles.lastCell]}>
            {formData.other_second_comeback || ''}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default ImmunizationPDF;
