/* eslint-disable @typescript-eslint/no-explicit-any */

import { nairaImg, PdfLogo, PdfSign } from "@/assets/images";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Register your custom font (.ttf file)

// Font.register({
//   family: "Times-Roman",
//   fonts: [{ src: Times-RomanRegular }, { src: Times-RomanBold }],
// });

const styles = StyleSheet.create({
  col4: { width: "25%" },
  col8: { width: "75%" },
  col6: { width: "50%" },
  mb8: { marginBottom: 8 },
  mb40: { marginBottom: 40 },
  overline: {
    fontSize: 8,
    marginBottom: 8,
    fontWeight: 700,
    textTransform: "uppercase",
  },
  h3: { fontSize: 16, fontWeight: 700 },
  h4: { fontSize: 13, fontWeight: 700 },
  body1: { fontSize: 10 },
  subtitle2: { fontSize: 9, fontWeight: 700 },
  alignRight: { textAlign: "right" },
  page: {
    padding: "20px ",
    fontSize: 9,
    lineHeight: 1.3,
    fontFamily: "Times-Roman",
    backgroundColor: "#fff",
    textTransform: "capitalize",
  },
  // page: {
  //   padding: 20,
  //   fontSize: 11,
  //   fontFamily: "Times-Roman",
  // },
  header: {
    display: "flex",
    marginBottom: 20,
    fontSize: 11,
    fontFamily: "Times-Roman",
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
    textTransform: "capitalize",
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
              fontFamily: "Times-Roman",
            }}
          >
            RC: 2409240
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 10,
              marginBottom: 2,
              fontFamily: "Times-Roman",
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
        <Text style={{ fontSize: 12, fontWeight: "bold", textAlign: "center" }}>
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
          <Text style={[styles.topText, { textTransform: "uppercase" }]}>
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
          paddingVertical: 10,
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

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.basicSalary / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />

              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.rent_allowance / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.hazard_allowance / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.travel_allowance / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.grossEarnings / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: 800,
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.salary_tax / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.pension_deduction / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.grossDeduction / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
          </View>
        </View>
      </View>

      <View
        style={{
          paddingVertical: 10,
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.grossEarnings / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.grossDeduction / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                }}
              >
                {(
                  Math.round(payslipData.netEarnings / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          paddingTop: 15,
          marginBottom: 30,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "bold", marginBottom: 20 }}>
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
            </Text>{" "}
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {(
                  Math.round(payslipData.cummulative_tax_deduction / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {(
                  Math.round(payslipData.cummulative_income / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
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
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={nairaImg}
                style={{
                  height: 13,
                  width: 13,
                  marginTop: -2,
                  marginRight: -2,
                }}
              />
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 11,
                  textAlign: "center",
                }}
              >
                {(
                  Math.round(payslipData.cummulative_pension / 10) * 10
                ).toLocaleString() || 0}
              </Text>
            </View>{" "}
          </View>
        </View>
        ,
      </View>

      <View style={{ marginTop: 10 }}>
        <View>
          <Image
            source={PdfSign}
            style={{ height: 40, width: 100, marginBottom: 5 }}
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
