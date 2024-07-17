import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Switch, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import { getUid } from '../storageUtils'; // Adjust the path as necessary
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MultiSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';

const items = [
  { id: '4', name: '4' },
  { id: 'HNG72', name: 'HNG72' },
  { id: 'HNG73', name: 'HNG73' },
  { id: 'HNG74', name: 'HNG74' },
  { id: 'HNG75', name: 'HNG75' },
];

const BookingScreen = ({ roomNumber = [], floor = '', customerId = '', extraBed = 'No', occupancy = '', checkinDate = new Date(), checkoutDate = new Date(), bookingDate = '', amount = '', amenities = '', exclusiveServices = '', isAvailable = true, userId = '', maleCount = '', femaleCount = '', childCount = '', companyName = '', companyAddress = '', companyContact = '', phoneNumber = '', discount = '', checkInTime = '', idProofType = '', idProofNumber = '', idProofPath = '', gst = '', totalPrice = '', customerName = '' }) => {
  const [selectedRoomNumbers, setSelectedRoomNumbers] = useState(roomNumber);
  const [stateFloor, setFloor] = useState(floor);
  const [stateCustomerId, setCustomerId] = useState(customerId);
  const [stateExtraBed, setExtraBed] = useState(extraBed);
  const [stateOccupancy, setOccupancy] = useState(occupancy);
  const [stateCheckinDate, setCheckinDate] = useState(checkinDate);
  const [stateCheckoutDate, setCheckoutDate] = useState(checkoutDate);
  const [stateBookingDate, setBookingDate] = useState(bookingDate);
  const [stateAmount, setAmount] = useState(amount);
  const [stateAmenities, setAmenities] = useState(amenities);
  const [stateExclusiveServices, setExclusiveServices] = useState(exclusiveServices);
  const [stateIsAvailable, setIsAvailable] = useState(isAvailable);
  const [stateUserId, setUserId] = useState(userId);
  const [stateMaleCount, setMaleCount] = useState(maleCount);
  const [stateFemaleCount, setFemaleCount] = useState(femaleCount);
  const [stateChildCount, setChildCount] = useState(childCount);
  const [stateCompanyName, setCompanyName] = useState(companyName);
  const [stateCompanyAddress, setCompanyAddress] = useState(companyAddress);
  const [stateCompanyContact, setCompanyContact] = useState(companyContact);
  const [statePhoneNumber, setPhoneNumber] = useState(phoneNumber);
  const [stateDiscount, setDiscount] = useState(discount);
  const [stateCheckInTime, setCheckInTime] = useState(checkInTime);
  const [stateIdProofType, setIdProofType] = useState(idProofType);
  const [stateIdProofNumber, setIdProofNumber] = useState(idProofNumber);
  const [stateIdProofPath, setIdProofPath] = useState(idProofPath);
  const [stateGst, setGst] = useState(gst);
  const [stateTotalPrice, setTotalPrice] = useState(totalPrice);
  const [stateCustomerName, setCustomerName] = useState(customerName);
  const [isCheckinDatePickerVisible, setCheckinDatePickerVisibility] = useState(false);
  const [isCheckoutDatePickerVisible, setCheckoutDatePickerVisibility] = useState(false);
  const [isCheckinTimePickerVisible, setCheckinTimePickerVisibility] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await getUid();
      console.log('Fetched userId:', storedUserId);
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [stateAmount, stateDiscount, stateGst]);

  useEffect(() => {
    calculateOccupancy();
  }, [stateMaleCount, stateFemaleCount, stateChildCount]);

  const handleConfirmCheckinDate = (date) => {
    setCheckinDate(date);
    setCheckinDatePickerVisibility(false);
  };

  const handleConfirmCheckoutDate = (date) => {
    setCheckoutDate(date);
    setCheckoutDatePickerVisibility(false);
  };

  const handleConfirmCheckinTime = (time) => {
    setCheckInTime(time.toTimeString().split(' ')[0]);
    setCheckinTimePickerVisibility(false);
  };

  const calculateTotalPrice = () => {
    const amount = parseFloat(stateAmount) || 0;
    const discount = parseFloat(stateDiscount) || 0;
    const gstPercentage = parseFloat(stateGst) || 0;
    const gstAmount = (amount - discount) * (gstPercentage / 100);
    const totalPrice = amount - discount + gstAmount;
    setTotalPrice(totalPrice.toFixed(2));
  };

  const calculateOccupancy = () => {
    const maleCount = parseInt(stateMaleCount) || 0;
    const femaleCount = parseInt(stateFemaleCount) || 0;
    const childCount = parseInt(stateChildCount) || 0;
    const totalCount = maleCount + femaleCount + childCount;
    setOccupancy(totalCount.toString());
  };

  const generateCustomerId = () => {
    if (stateCustomerName) {
      const id = stateCustomerName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      setCustomerId(id);
    } else {
      alert('Please enter the customer name first.');
    }
  };

  const handleSubmit = async () => {
    console.log('Submitting room with userId:', stateUserId);
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/api/RoomBooking`, {
        userId: stateUserId,
        roomNumber: selectedRoomNumbers,
        floor: stateFloor,
        customerId: stateCustomerId,
        extraBed: stateExtraBed,
        occupancy: stateOccupancy,
        checkinDate: stateCheckinDate,
        checkoutDate: stateCheckoutDate,
        bookingDate: stateBookingDate,
        amount: stateAmount,
        amenities: stateAmenities,
        isAvailable: stateIsAvailable,
        exclusiveServices: stateExclusiveServices,
        maleCount: stateMaleCount,
        femaleCount: stateFemaleCount,
        childCount: stateChildCount,
        companyName: stateCompanyName,
        companyAddress: stateCompanyAddress,
        companyContact: stateCompanyContact,
        phoneNumber: statePhoneNumber,
        discount: stateDiscount,
        checkInTime: stateCheckInTime,
        idProofType: stateIdProofType,
        idProofNumber: stateIdProofNumber,
        idProofPath: stateIdProofPath,
        gst: stateGst,
        totalPrice: stateTotalPrice,
        customerName: stateCustomerName
      });
      console.log('Room Booking successfully:', response.data);
      alert('Room Booked Successfully! Welcome!!');
    } catch (error) {
      console.error('Error adding room:', error.response ? error.response.data : error.message);
      alert('Failed to Book room. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Room Booking</Text>
        <Text style={styles.label}>Room Number</Text>
        <MultiSelect
          items={items}
          uniqueKey="id"
          onSelectedItemsChange={(selectedItems) => setSelectedRoomNumbers(selectedItems)}
          selectedItems={selectedRoomNumbers}
          selectText="Pick Room Numbers"
          searchInputPlaceholderText="Search Rooms..."
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: '#CCC' }}
          submitButtonColor="#48d22b"
          submitButtonText="Submit"
          style={styles.multiSelect}
        />
        <TextInput
          style={styles.input}
          placeholder="Floor"
          value={stateFloor}
          onChangeText={setFloor}
        />
        <View style={styles.customerIdContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Customer ID"
            value={stateCustomerId}
            onChangeText={setCustomerId}
          />
          <TouchableOpacity onPress={generateCustomerId} style={styles.generateButton}>
            <Icon name="autorenew" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={stateCustomerName}
          onChangeText={setCustomerName}
        />
        <TextInput
          style={styles.input}
          placeholder="Male Count"
          value={stateMaleCount}
          onChangeText={setMaleCount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Female Count"
          value={stateFemaleCount}
          onChangeText={setFemaleCount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Child Count"
          value={stateChildCount}
          onChangeText={setChildCount}
          keyboardType="numeric"
        />
       
        <Text style={styles.label}>Total Count: {stateOccupancy}</Text>
        <TextInput
          style={styles.input}
          placeholder="Company Name"
          value={stateCompanyName}
          onChangeText={setCompanyName}
        />
        <TextInput
          style={styles.input}
          placeholder="Company Address"
          value={stateCompanyAddress}
          onChangeText={setCompanyAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Company Contact"
          value={stateCompanyContact}
          onChangeText={setCompanyContact}
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={statePhoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={() => setCheckinDatePickerVisibility(true)}>
          <Text style={styles.dateInput}>Check-in Date: {stateCheckinDate.toDateString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isCheckinDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmCheckinDate}
          onCancel={() => setCheckinDatePickerVisibility(false)}
        />
        <TouchableOpacity onPress={() => setCheckoutDatePickerVisibility(true)}>
          <Text style={styles.dateInput}>Check-out Date: {stateCheckoutDate.toDateString()}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isCheckoutDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmCheckoutDate}
          onCancel={() => setCheckoutDatePickerVisibility(false)}
        />
        <TouchableOpacity onPress={() => setCheckinTimePickerVisibility(true)}>
          <Text style={styles.dateInput}>Check-in Time: {stateCheckInTime}</Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isCheckinTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmCheckinTime}
          onCancel={() => setCheckinTimePickerVisibility(false)}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={stateAmount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Discount"
          value={stateDiscount}
          onChangeText={setDiscount}
          keyboardType="numeric"
        />
        <Text style={styles.label}>GST Percentage</Text>
        <Picker
          selectedValue={stateGst}
          onValueChange={(itemValue) => setGst(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="18%" value="18" />
          <Picker.Item label="16%" value="16" />
          <Picker.Item label="12%" value="12" />
          <Picker.Item label="10%" value="10" />
          <Picker.Item label="8%" value="8" />
        </Picker>
        <Text style={styles.label}>Total Price: {stateTotalPrice}</Text>
        <Text style={styles.label}>ID Proof Type</Text>
        <Picker
          selectedValue={stateIdProofType}
          onValueChange={(itemValue) => setIdProofType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Aadhar Card" value="Aadhar Card" />
          <Picker.Item label="Pan Card" value="Pan Card" />
          <Picker.Item label="Driving Licence" value="Driving Licence" />
          <Picker.Item label="Passport" value="Passport" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="ID Proof Number"
          value={stateIdProofNumber}
          onChangeText={setIdProofNumber}
        />
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Add Regular Customer</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={stateIsAvailable ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsAvailable}
            value={stateIsAvailable}
          />
        </View>
        <Button
          title="Add Luxury Room"
          onPress={handleSubmit}
          color="#0066cc"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  noticeBoard: {
    marginBottom: 20,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noticeItem: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  noticeText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noticeDesc: {
    fontSize: 14,
    marginBottom: 5,
  },
  noticeLink: {
    color: '#0066cc',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  actionText: {
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  customerIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  generateButton: {
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dateInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    lineHeight: 40,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  picker: {
    marginBottom: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiSelect: {
    marginBottom: 10,
  },
});

export default BookingScreen;
