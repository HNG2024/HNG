import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ScrollView, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const Invoice = () => {
  const [editable, setEditable] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [invoiceData, setInvoiceData] = useState({
    id: uuid.v4(),
    to: '',
    date: new Date().toLocaleDateString(),
    invoiceNo: '',
    ref: '',
    description: '',
    amount: '',
    paymentMethod: '',
    accountNo: '',
    subTotal: '',
    total: '',
    terms: 'Please make payment within 30 days of receiving this invoice. There will be a 5% interest charge per month on late invoices.'
  });

  useEffect(() => {
    generateInvoiceNumber();
  }, []);

  const generateInvoiceNumber = async () => {
    const lastInvoiceNumber = await AsyncStorage.getItem('lastInvoiceNumber') || '1000';
    const newInvoiceNumber = (parseInt(lastInvoiceNumber) + 1).toString();
    await AsyncStorage.setItem('lastInvoiceNumber', newInvoiceNumber);
    setInvoiceData({ ...invoiceData, invoiceNo: newInvoiceNumber });
  };

  const handleInputChange = (field, value) => {
    setInvoiceData({ ...invoiceData, [field]: value });
  };

  const handlePrint = async () => {
    if (printing) return;

    setPrinting(true);
    try {
      const html = generateHTML();
      await Print.printAsync({ html });
    } catch (error) {
      console.error('Error during printing:', error);
    } finally {
      setPrinting(false);
    }
  };

  const handleDownload = async () => {
    if (printing) return;

    setPrinting(true);
    try {
      const html = generateHTML();
      const { uri } = await Print.printToFileAsync({ html });
      const newPath = FileSystem.documentDirectory + `invoice_${invoiceData.invoiceNo}.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: newPath
      });
      Alert.alert('Download complete', `Invoice saved at ${newPath}`);
    } catch (error) {
      console.error('Error during downloading:', error);
    } finally {
      setPrinting(false);
    }
  };

  const handleSaveCustomer = async () => {
    const customers = JSON.parse(await AsyncStorage.getItem('customers')) || [];
    const existingCustomer = customers.find(customer => customer.to === invoiceData.to);
    if (!existingCustomer) {
      customers.push(invoiceData);
      await AsyncStorage.setItem(`customer_${invoiceData.id}`, JSON.stringify(invoiceData));
      await AsyncStorage.setItem('customers', JSON.stringify(customers));
    }
  };

  const handleLoadCustomer = async (customerName) => {
    const customers = JSON.parse(await AsyncStorage.getItem('customers')) || [];
    const customer = customers.find(customer => customer.to === customerName);
    if (customer) {
      setInvoiceData(customer);
    }
  };

  const handleLoadCustomerById = async (customerId) => {
    const customerData = JSON.parse(await AsyncStorage.getItem(`customer_${customerId}`));
    if (customerData) {
      setInvoiceData(customerData);
    } else {
      Alert.alert('Customer not found', `No customer found with ID: ${customerId}`);
    }
  };

  const generateHTML = () => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: auto; }
            .header { background-color: #4B0082; padding: 10px; text-align: center; font-size: 20px; font-weight: bold; color: #fff; }
            .invoiceContainer { background-color: #FFFFFF; padding: 20px; margin-top: 20px; border: 1px solid #ddd; }
            .title { font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 10px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .payment, .total, .terms { margin-top: 20px; }
            .footer { text-align: center; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">Invoice</div>
            <div class="invoiceContainer">
              <p><strong>Invoice to:</strong> ${invoiceData.to}</p>
              <p><strong>Date:</strong> ${invoiceData.date}</p>
              <p><strong>Invoice No:</strong> ${invoiceData.invoiceNo}</p>
              <p><strong>Ref:</strong> ${invoiceData.ref}</p>
              <p><strong>Description:</strong> ${invoiceData.description}</p>
              <p><strong>Amount:</strong> ${invoiceData.amount}</p>
              <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod}</p>
              <p><strong>Account No.:</strong> ${invoiceData.accountNo}</p>
              <p><strong>Sub-Total:</strong> ${invoiceData.subTotal}</p>
              <p><strong>Total:</strong> ${invoiceData.total}</p>
              <p><strong>Terms and Conditions:</strong> ${invoiceData.terms}</p>
              <p class="footer">HNG</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Invoice</Text>
        <TouchableOpacity onPress={() => setEditable(!editable)}>
          <Text style={styles.editButton}>{editable ? 'Save' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.invoiceContainer}>
        <TextInput
          style={styles.input}
          value={invoiceData.to}
          editable={editable}
          onChangeText={(text) => handleInputChange('to', text)}
          onBlur={() => handleLoadCustomer(invoiceData.to)}
          placeholder="Customer Name"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Customer ID to Load Details"
          onSubmitEditing={(event) => handleLoadCustomerById(event.nativeEvent.text)}
        />
        <TextInput
          style={styles.input}
          value={invoiceData.date}
          editable={editable}
          onChangeText={(text) => handleInputChange('date', text)}
        />
        <TextInput
          style={styles.input}
          value={invoiceData.invoiceNo}
          editable={false}
        />
        <TextInput
          style={styles.input}
          value={invoiceData.ref}
          editable={editable}
          onChangeText={(text) => handleInputChange('ref', text)}
        />
        <TextInput
          style={styles.input}
          value={invoiceData.description}
          editable={editable}
          onChangeText={(text) => handleInputChange('description', text)}
          placeholder="Description"
        />
        <TextInput
          style={styles.input}
          value={invoiceData.amount}
          editable={editable}
          onChangeText={(text) => handleInputChange('amount', text)}
          placeholder="Amount"
        />
        <TextInput
          style={styles.input}
          value={invoiceData.paymentMethod}
          editable={editable}
          onChangeText={(text) => handleInputChange('paymentMethod', text)}
          placeholder="Payment Method"
        />
        <TextInput
          style={styles.input}
          value={invoiceData.accountNo}
          editable={editable}
          onChangeText={(text) => handleInputChange('accountNo', text)}
          placeholder="Account No."
        />
        <TextInput
          style={styles.input}
          value={invoiceData.subTotal}
          editable={editable}
          onChangeText={(text) => handleInputChange('subTotal', text)}
          placeholder="Sub-Total"
        />
        <TextInput
          style={styles.input}
          value={invoiceData.total}
          editable={editable}
          onChangeText={(text) => handleInputChange('total', text)}
          placeholder="Total"
        />
        <TextInput
          style={styles.input}
          value={invoiceData.terms}
          editable={editable}
          onChangeText={(text) => handleInputChange('terms', text)}
        />
        <Text style={styles.footer}>HNG</Text>
      </View>
      <TouchableOpacity style={styles.printButton} onPress={handlePrint} disabled={printing}>
        <Text style={styles.printButtonText}>Print</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.downloadButton} onPress={handleDownload} disabled={printing}>
        <Text style={styles.printButtonText}>Download</Text>
      </TouchableOpacity>
      {editable && (
        <Button title="Save Customer" onPress={handleSaveCustomer} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F4F9FD', // Light background color
    padding: 20,
  },
  header: {
    backgroundColor: '#E1AFD1', // Pinkish color for the header
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff', // White color for header text
  },
  editButton: {
    color: '#000',
    backgroundColor: '#F4F9FD', // Light background color for the button
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  invoiceContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    marginBottom: 10,
  },
  printButton: {
    backgroundColor: '#E1AFD1', // Pinkish color for the print button
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  printButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff', // White color for the button text
  },
  downloadButton: {
    backgroundColor: '#EC6565', // Red color for the download button
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
  },
});

export default Invoice;
