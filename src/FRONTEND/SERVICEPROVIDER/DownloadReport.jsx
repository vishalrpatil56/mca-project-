import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

//  Local Font
import Roboto from "../../fonts/Roboto-Regular.ttf";

Font.register({
  family: "Roboto",
  src: Roboto,
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Roboto",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2px solid #2E86C1",
    paddingBottom: 10,
  },

  company: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F4E79",
  },

  gst: {
    fontSize: 10,
    color: "#555",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  section: {
    marginBottom: 15,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  table: {
    border: "1px solid #ccc",
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
  },

  headerRow: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },

  cell: {
    flex: 1,
    padding: 6,
  },

  totalSection: {
    marginTop: 15,
    alignItems: "flex-end",
  },

  total: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#27AE60",
  },

  signature: {
    marginTop: 40,
    textAlign: "right",
  },

  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#888",
  },
});

const OrdersPDF = ({ order }) => {
  if (!order) return null;

  const grandTotal = Number(order.total || 0);

const taxableAmount = grandTotal / 1.18;

const gst = grandTotal - taxableAmount;

const cgst = gst / 2;
const sgst = gst / 2;

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ✅ HEADER */}
        <View style={styles.header}>
          
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            
            {/* LOGO */}
            <Image
              src="/uploads/Untitled design.jpeg"
              style={{
                width: 80,
                height: 50,
                objectFit: "contain",
                marginRight: 10,
              }}
            />

            <View>
              <Text style={styles.company}>Balaji Enterprise</Text>
              <Text style={styles.gst}>GSTIN: 27ABCDE1234F1Z5</Text>
              <Text>Nippani, Karnataka</Text>
            </View>

          </View>

          <Text style={styles.title}>INVOICE</Text>
        </View>

        {/* ORDER INFO */}
        <View style={styles.rowBetween}>
          <Text>Invoice No: INV-{order.id}</Text>
          <Text>Date: {order.date}</Text>
        </View>

        {/* CUSTOMER */}
        <View style={styles.section}>
          <Text style={{ fontWeight: "bold" }}>Bill To:</Text>
          <Text>{order.customer?.name}</Text>
          <Text>{order.customer?.email}</Text>
          <Text>{order.customer?.phone}</Text>
          <Text>{order.customer?.address}</Text>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.cell}>Product</Text>
            <Text style={styles.cell}>Qty</Text>
            <Text style={styles.cell}>Price</Text>
            <Text style={styles.cell}>Total</Text>
          </View>

          {order.products?.map((p, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cell}>{p.name}</Text>
              <Text style={styles.cell}>{p.quantity || 1}</Text>
              <Text style={styles.cell}>
                {`₹ ${p.price.toLocaleString("en-IN")}`}
              </Text>
              <Text style={styles.cell}>
                {`₹ ${p.price.toLocaleString("en-IN")}`}
              </Text>
            </View>
          ))}
        </View>

        {/* TOTAL */}
        <View style={styles.totalSection}>
          <Text>{`Taxable Amount: ₹ ${taxableAmount.toFixed(2)}`}</Text>
          <Text>{`CGST (9%): ₹ ${cgst.toLocaleString("en-IN")}`}</Text>
          <Text>{`SGST (9%): ₹ ${sgst.toLocaleString("en-IN")}`}</Text>
          <Text style={styles.total}>
            {`Grand Total: ₹ ${grandTotal.toLocaleString("en-IN")}`}
          </Text>
        </View>

        {/* SIGNATURE */}
        <View style={styles.signature}>
          <Text>Authorized Signature</Text>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
          Thank you for your business 
        </Text>

      </Page>
    </Document>
  );
};

const DownloadInvoice = ({ order }) => {
  if (!order) return null;

  return (
  <div
    style={{
      position: "relative",
      zIndex: 999,
      display: "inline-block",
    }}
  >
    <PDFDownloadLink
      document={<OrdersPDF order={order} />}
      fileName={`Invoice_${order.id}.pdf`}
      style={{ textDecoration: "none" }}
    >
      {({ loading }) => (
        <div
          style={{
            border: "1px solid #2563eb",
            backgroundColor: "#eff6ff",
            color: "#2563eb",
            padding: "7px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            minWidth: "110px",
            userSelect: "none",
          }}
        >
          {loading ? "Generating..." : "📄 Invoice"}
        </div>
      )}
    </PDFDownloadLink>
  </div>
);
};

export default DownloadInvoice;