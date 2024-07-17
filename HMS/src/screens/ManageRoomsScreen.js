import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import axios from 'axios';
import { REACT_APP_API_URL } from '@env';
import { getUid } from '../storageUtils'; // Adjust the path as necessary

const ManageRoomsScreen = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const storedUserId = await getUid();
     
      setUserId(storedUserId);
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`${REACT_APP_API_URL}/api/rooms`, {
          params: { userId },
        });
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [userId]);

  const groupRoomsByFloor = () => {
    const floors = {};
    rooms.forEach(room => {
      const floorNo = room.floor_no;
      if (!floors[floorNo]) {
        floors[floorNo] = [];
      }
      floors[floorNo].push(room);
    });
    return floors;
  };

  const handleRoomPress = (room) => {
    setSelectedRoom(room);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const floors = groupRoomsByFloor();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Room Book</Text>
      <View style={styles.infoButtonContainer}>
        <TouchableOpacity style={styles.infoButton}>
          <Text style={styles.infoButtonText}>Info/help</Text>
        </TouchableOpacity>
      </View>
      {Object.keys(floors).map(floorNo => (
        <View key={floorNo} style={styles.floorContainer}>
          <Text style={styles.floorHeader}>{`Floor ${floorNo}`}</Text>
          <View style={styles.roomsContainer}>
            {floors[floorNo].map(room => (
              <TouchableOpacity
                key={room.id}
                style={[
                  styles.roomCard,
                  { backgroundColor: room.available_room === 'yes' ? '#73BBA3' : '#ffa500' }, // Green for available, orange for not available
                ]}
                onPress={() => handleRoomPress(room)}
              >
                <Text style={styles.roomNumber}>Room Number: {room.room_no}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      {selectedRoom && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
            <Text style={styles.close} onPress={() => setModalVisible(false)} >x</Text>
              <Text style={styles.modalHeader}>Room Details</Text>
              <Text>Room Number: {selectedRoom.room_no}</Text>
              <Text>Floor: {selectedRoom.floor_no}</Text>
              <Text>Type: {selectedRoom.room_type}</Text>
              <Text>View: {selectedRoom.view_type}</Text>
              <Text>Bed: {selectedRoom.bed_type}</Text>
              <Text>Max Occupancy: {selectedRoom.max_occupancy}</Text>
              <Text>Size: {selectedRoom.room_size} sq ft</Text>
              <Text>Price: ${selectedRoom.price_pernight} per night</Text>
              <Text>Amenities: {selectedRoom.amenities_room}</Text>
              <Text>Exclusive Services: {selectedRoom.exclusive_services}</Text>
              <Text>Available: {selectedRoom.available_room === 'yes' ? 'Yes' : 'No'}</Text>
              
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#4B0082',
  },
  infoButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  infoButton: {
    backgroundColor: '#4B0082',
    padding: 10,
    borderRadius: 20,
  },
  infoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  floorContainer: {
    marginBottom: 20,
  },
  floorHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#DCDCDC',
    padding: 10,
    borderRadius: 10,
  },
  roomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roomCard: {
    width: '48%',
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  roomNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  close:{
    position: 'absolute',
    top: 0,
    right: 20,
    fontSize: 28,

},
});

export default ManageRoomsScreen;
