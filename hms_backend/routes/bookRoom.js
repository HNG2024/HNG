const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

router.post('/RoomBooking', async (req, res) => {
  const {
    userId,
    roomNumber,
    floor,
    customerId,
    extraBed,
    occupancy,
    checkinDate,
    checkoutDate,
    bookingDate,
    amount,
    amenities,
    isAvailable,
    exclusiveServices,
    maleCount,
    femaleCount,
    childCount,
    companyName,
    companyAddress,
    companyContact,
    phoneNumber,
    discount,
    checkInTime,
    idProofType,
    idProofNumber,
    idProofPath,
    gst,
    totalPrice,
    customerName
  } = req.body;

  console.log('Received userId:', userId);

  try {
    const companyDatabase = userId;

    console.log('Connecting to database:', companyDatabase);

    const companyPool = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: companyDatabase,
      port: process.env.DB_PORT,
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS roombookinginfo (
        userId VARCHAR(255),
        roomNumber VARCHAR(255),
        floor VARCHAR(50),
        customerId VARCHAR(255) PRIMARY KEY,
        extraBed VARCHAR(50),
        occupancy INT,
        checkinDate DATE,
        checkoutDate DATE,
        bookingDate DATE,
        amount DECIMAL(10, 2),
        amenities TEXT,
        isAvailable BOOLEAN,
        exclusiveServices TEXT,
        maleCount INT,
        femaleCount INT,
        childCount INT,
        companyName VARCHAR(255),
        companyAddress VARCHAR(255),
        companyContact VARCHAR(255),
        phoneNumber VARCHAR(20),
        discount DECIMAL(10, 2),
        checkInTime TIME,
        idProofType VARCHAR(50),
        idProofNumber VARCHAR(255),
        idProofPath VARCHAR(255),
        gst DECIMAL(10, 2),
        totalPrice DECIMAL(10, 2),
        customerName VARCHAR(255)
      )
    `;
    await companyPool.query(createTableQuery);

    const query = `
      INSERT INTO roombookinginfo (userId, roomNumber, floor, customerId, extraBed, occupancy, checkinDate, checkoutDate, bookingDate, amount, amenities, isAvailable, exclusiveServices, maleCount, femaleCount, childCount, companyName, companyAddress, companyContact, phoneNumber, discount, checkInTime, idProofType, idProofNumber, idProofPath, gst, totalPrice, customerName)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const Upadtequery=` UPDATE roominfo SET available_room = 'no' WHERE room_no = ${roomNumber}`; 
    await companyPool.query(query, Upadtequery[
      userId,
      roomNumber,
      floor,
      customerId,
      extraBed,
      occupancy,
      checkinDate,
      checkoutDate,
      bookingDate,
      amount,
      amenities,
      isAvailable,
      exclusiveServices,
      maleCount,
      femaleCount,
      childCount,
      companyName,
      companyAddress,
      companyContact,
      phoneNumber,
      discount,
      checkInTime,
      idProofType,
      idProofNumber,
      idProofPath,
      gst,
      totalPrice,
      customerName
    ]);

    res.status(201).json({
      message: 'Room added successfully'
    });
  } catch (error) {
    console.error('Error inserting room data:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

module.exports = router;
