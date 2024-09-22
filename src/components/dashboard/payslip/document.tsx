/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Custom styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    fontSize: 12,
    textAlign: "center",
  },
  section: {
    margin: 10,
  },
  table: {
    display: "flex",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  tableCellHeader: {
    padding: 5,
    backgroundColor: "#E0E0E0",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
  },
  flexRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textBold: {
    fontWeight: "bold",
  },
});

const PayslipDocument = ({ payslipData }: { payslipData: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>
          SHAYOFUNMI Care Agency
        </Text>
        <Text>The Caring Professionals</Text>
        <Text>RC: 2409240</Text>
        <Text>
          Road 16, Magbon/Ereko Boundary, Oke-Muti, Lagos/Ogun State, Nigeria.
        </Text>
        <Text>
          Email: shayofumicareagencycv@yahoo.com | Tel: +2348169333080
        </Text>
      </View>

      {/* Payslip Info */}
      <View style={styles.section}>
        <Text>Payslip No: {payslipData.payslipNo}</Text>
        <Text>
          EMPLOYEE PAYSLIP -{" "}
          {payslipData.payslipCurrentMonth.toLocaleString("default", {
            month: "long",
          })}
          , {payslipData.payslipCurrentMonth.getFullYear()}
        </Text>
      </View>

      <View style={styles.flexRow}>
        <Text>Employment No: {payslipData.employmentNo}</Text>
        <Text>Gender: {payslipData.gender}</Text>
      </View>

      <View style={styles.flexRow}>
        <Text>Name: {payslipData.fullName}</Text>
        <Text>
          Date of First Appointment:{" "}
          {payslipData.dateofappointment.toLocaleDateString()}
        </Text>
      </View>

      {/* Additional fields and calculations */}
      {/* Earnings and Deductions Table */}
      <View style={{ marginVertical: 10 }}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCellHeader, { flex: 1 }]}>
              <Text>Earnings</Text>
            </View>
            <View style={[styles.tableCellHeader, { flex: 1 }]}>
              <Text>Amount</Text>
            </View>
            <View style={[styles.tableCellHeader, { flex: 1 }]}>
              <Text>Deduction</Text>
            </View>
            <View style={[styles.tableCellHeader, { flex: 1 }]}>
              <Text>Amount</Text>
            </View>
          </View>
          {/* Table Data */}
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Basic Salary</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>₦{payslipData.basicSalary.toLocaleString()}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Salary Tax</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>₦{payslipData.salary_tax.toLocaleString()}</Text>
            </View>
          </View>
          {/* Repeat for other allowances and deductions */}
        </View>
      </View>

      {/* Totals */}
      <View style={styles.flexRow}>
        <Text>
          Total Gross Earnings: ₦{payslipData.grossEarnings.toLocaleString()}
        </Text>
        <Text>
          Total Gross Deductions: ₦{payslipData.grossDeduction.toLocaleString()}
        </Text>
      </View>

      <View style={styles.flexRow}>
        <Text style={styles.textBold}>
          Total Net Earnings: ₦{payslipData.netEarnings.toLocaleString()}
        </Text>
      </View>

      {/* Balances Section */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.textBold}>Balances:</Text>
        <View style={styles.flexRow}>
          <Text>
            Cummulative Tax Deduct: ₦
            {payslipData.cummulative_tax_deduction.toLocaleString()}
          </Text>
          <Text>
            Cummulative Income: ₦
            {payslipData.cummulative_income.toLocaleString()}
          </Text>
          <Text>
            Cummulative Pension: ₦
            {payslipData.cummulative_pension.toLocaleString()}
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PayslipDocument;
