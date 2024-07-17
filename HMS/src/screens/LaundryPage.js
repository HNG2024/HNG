import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';

const laundryItems = [
    { id: '1', name: 'Shirt' },
    { id: '2', name: 'Pants' },
    { id: '3', name: 'Dress' },
    { id: '4', name: 'Jacket' },
];

const LaundryPage = () => {
    const [selectedItems, setSelectedItems] = useState({});
    const [roomNumber, setRoomNumber] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');

    const handleSelectItem = (item) => {
        const currentCount = selectedItems[item.id] || 0;
        setSelectedItems({ ...selectedItems, [item.id]: currentCount + 1 });
    };

    const handleDeselectItem = (item) => {
        const currentCount = selectedItems[item.id] || 0;
        if (currentCount > 0) {
            setSelectedItems({ ...selectedItems, [item.id]: currentCount - 1 });
        }
    };

    const handleSubmit = () => {
        console.log('Room Number:', roomNumber);
        console.log('Selected Items:', selectedItems);
        console.log('Special Instructions:', specialInstructions);
        // Handle the form submission (e.g., send to a server or local storage)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hotel Laundry Service</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your room number"
                value={roomNumber}
                onChangeText={setRoomNumber}
            />
            <FlatList
                data={laundryItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.button} onPress={() => handleSelectItem(item)}>
                                <Text style={styles.buttonText}>+</Text>
                            </TouchableOpacity>
                            <Text style={styles.itemCount}>{selectedItems[item.id] || 0}</Text>
                            <TouchableOpacity style={styles.button} onPress={() => handleDeselectItem(item)}>
                                <Text style={styles.buttonText}>-</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Special Instructions"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
            />
            <TouchableOpacity style={[styles.submitButton, { backgroundColor: '#6f42c1' }]} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 2,
    },
    itemText: {
        fontSize: 16,
    },
    buttonGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6f42c1',
        padding: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    itemCount: {
        fontSize: 16,
        marginHorizontal: 10,
    },
    submitButton: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LaundryPage;
