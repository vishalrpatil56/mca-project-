import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 14,
    marginBottom: 4,
    textDecoration: 'underline',
  },
  orderBox: {
    borderBottom: '1 solid #ccc',
    marginBottom: 8,
    paddingBottom: 4,
  },
});

const ReportDocument = ({ orders }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Service Provider Report</Text>

      {orders.map((order, idx) => (
        <View key={idx} style={styles.orderBox}>
          <Text>Order ID: {order.id}</Text>
          <Text>Date: {order.date}</Text>
          <Text>Customer: {order.customer.name}</Text>
          <Text>Email: {order.customer.email}</Text>
          <Text>Phone: {order.customer.phone}</Text>
          <Text>Total: ₹{order.total.toLocaleString()}</Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default ReportDocument;
