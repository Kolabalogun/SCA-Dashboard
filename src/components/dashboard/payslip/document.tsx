/* eslint-disable @typescript-eslint/no-explicit-any */
import { HelveticaBold, HelveticaRegular } from "@/assets/font/Helvetica";
import { PdfLogo, PdfSign } from "@/assets/images";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

// Register your custom font (.ttf file)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: HelveticaRegular, fontWeight: 400 }, // Normal

    { src: HelveticaBold, fontWeight: "bold" }, // Bold
  ],
});

// Custom styles for the PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    display: "flex",
    marginBottom: 20,
    fontSize: 11,
    fontFamily: "Helvetica",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },

  topText: {
    fontWeight: "bold",
    fontSize: 11,
    marginBottom: 3,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  section: {
    marginTop: 15,
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
        <View>
          <Image source={PdfLogo} style={{ height: 110, width: 250 }} />
        </View>

        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              marginBottom: 2,
              fontFamily: "Helvetica",
            }}
          >
            RC: 2409240
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              marginBottom: 2,
              fontFamily: "Helvetica",
            }}
          >
            Road 16, Magbon/Ereko Boundary,
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 2 }}>
            Oke-Muti, Lagos/Ogun State, Nigeria.
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              color: "blue",
              textDecoration: "underline",
              marginBottom: 2,
            }}
          >
            Email: shayofumicareagencycv@yahoo.com
          </Text>
          <Text style={{ fontWeight: "bold", fontSize: 10, marginBottom: 2 }}>
            Tel: +2348169333080
          </Text>

          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              color: "blue",
              textDecoration: "underline",
            }}
          >
            www.shayofunmicareagency.net
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 11, fontWeight: "bold", fontStyle: "italic" }}>
        Payslip No: {payslipData.payslipNo}
      </Text>

      {/* Payslip Info */}
      <View style={styles.section}>
        <Text style={{ fontSize: 14, fontWeight: "bold", textAlign: "center" }}>
          EMPLOYEE PAYSLIP
        </Text>
        <Text style={{ fontSize: 11, fontWeight: "bold", textAlign: "center" }}>
          {payslipData.payslipCurrentMonth.toLocaleString("default", {
            month: "long",
          })}
          , {payslipData.payslipCurrentMonth.getFullYear()}
        </Text>
      </View>

      <View style={{ paddingVertical: 15, borderBottom: "2px black solid" }}>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.topText}>
            Employment No: {payslipData.employmentNo}
          </Text>
        </View>
        <View style={[styles.flexRow]}>
          <Text style={[styles.topText, { textTransform: "uppercase" }]}>
            Name: {payslipData.fullName}
          </Text>
          <Text style={styles.topText}>Gender: {payslipData.gender}</Text>
        </View>

        <View style={styles.flexRow}>
          <Text style={styles.topText}>
            Designation: {payslipData.occupation}
          </Text>
          <Text style={styles.topText}>
            Date of First Appointment:{" "}
            {payslipData.dateofappointment.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.flexRow}>
          <Text style={styles.topText}>Address: {payslipData.address}</Text>
        </View>
      </View>

      <View
        style={{
          paddingVertical: 15,
          borderBottom: "2px black solid",
          display: "flex",
          justifyContent: "space-between",
          gap: 50,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 11,
              textAlign: "center",
              marginBottom: 9,
            }}
          >
            Gross Earnings Information
          </Text>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Earnings
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Amount
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Basic Salary
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.basicSalary / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Rent Allowance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.rent_allowance / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Hazard Allowance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.hazard_allowance / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Travel Allowance
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.travel_allowance / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Total Gross Earnings
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.grossEarnings / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 11,
              textAlign: "center",
              marginBottom: 9,
            }}
          >
            Gross Deduction Information
          </Text>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Deduction
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Amount
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Salary Tax
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.salary_tax / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Pension Deduction
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.pension_deduction / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              -
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              -
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 7,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              -
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              -
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Total Gross Deduction
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.grossDeduction / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          paddingVertical: 15,
          borderBottom: "2px black solid",
          display: "flex",
          justifyContent: "space-between",
          gap: 50,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 1 }}></View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 11,
              textAlign: "center",
              marginBottom: 9,
            }}
          >
            Summary of Payments
          </Text>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Total Gross Earnings
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.grossEarnings / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              paddingBottom: 7,
              borderBottom: "1px solid black",
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Total Gross Deductions
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.grossDeduction / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              flexDirection: "row",
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              Total Net Earnings:
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
              }}
            >
              {"\u20A6"}

              {(
                Math.round(payslipData.netEarnings / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          paddingVertical: 25,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 30 }}>
          Balances
        </Text>
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,

              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              Cummulative Tax Deduct
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.cummulative_tax_deduction / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              Cummulative Income
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.cummulative_income / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              textAlign: "center",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                textDecoration: "underline",
                textAlign: "center",
              }}
            >
              Cummulative Pension
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 11,
                textAlign: "center",
              }}
            >
              {"\u20A6"}
              {(
                Math.round(payslipData.cummulative_pension / 10) * 10
              ).toLocaleString() || 0}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <View>
          <Image
            source={PdfSign}
            style={{ height: 40, width: 100, marginBottom: 10 }}
          />
        </View>

        <View>
          <Text style={{ fontSize: 11 }}>
            Account Unit - Shayofunmi care agency
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default PayslipDocument;
