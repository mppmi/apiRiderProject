import { conn } from "../dbconnect"; 
import express from "express";
import mysql from "mysql";
const bcrypt = require("bcryptjs");
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, deleteObject, listAll } from "firebase/storage";

export const router = express.Router();

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyAiVnY-8Ajak4xVeQNLzynr8skqCgNFulg',
//   appId: '1:259988227090:android:db894289cac749ff6c04cb',
//   messagingSenderId: '259988227090',
//   projectId: 'project-rider-1b5ac',
//   storageBucket: 'project-rider-1b5ac.appspot.com',
// };
// // Initialize Firebase
// initializeApp(firebaseConfig);
// const storage = getStorage();

// // Multer setup for file uploads
// class FileMiddleware {
//   filename = "";

//   public readonly diskLoader = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 67108864 }, // 64MB limit
//   });
// }
// const fileUpload = new FileMiddleware();



// Get specific user by userID
router.get('/rider', (req, res) => {
    const riderID = req.query.riderID; 

    const query = 'SELECT * FROM riders WHERE riderID = ?';

    conn.query(query, [riderID], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database query error' });
      }

      if (results.length > 0) {
        res.json(results);
      } else {
        res.status(404).json({ error: 'No users found' });
      }
    });
});
interface Product {
    productID: number;
    productPhoto: string;
    detail: string;
  }
  
  interface Order {
    orderID: number;
    userID: number;
    name: string;
    phone: string;
    orderPhoto: string;
    userPhoto: string;
    address: string;
    products: Product[];
  }
  
  router.get('/order', (req, res) => {
    const query = `
      SELECT 
          o.orderID,
          u.userID,   
          u.name, 
          u.phone, 
          u.photo AS userPhoto, 
          u.address, 
          p.productID, 
          p.photo AS productPhoto, 
          p.detail,
          o.photo AS orderPhoto 
      FROM 
          users u 
      JOIN 
          products p ON u.userID = p.userID 
      JOIN 
          \`order\` o ON p.orderID = o.orderID
      WHERE
          o.photo IS NOT NULL AND o.photo != '0' AND o.photo != ''
    `;
  
    conn.query(query, (error, results: any[]) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      if (results.length > 0) {
        const orders: { [key: number]: Order } = {};
  
        results.forEach(item => {
          const orderID = item.orderID;
  
          if (!orders[orderID]) {
            orders[orderID] = {
              orderID: orderID,
              userID: item.userID,
              name: item.name,
              orderPhoto: item.orderPhoto,
              phone: item.phone,
              userPhoto: item.userPhoto,
              address: item.address,
              products: []
            };
          }
  
          orders[orderID].products.push({
            productID: item.productID,
            productPhoto: item.productPhoto,
            detail: item.detail
          });
        });
  
        const resultArray: Order[] = Object.values(orders);
        res.status(200).json(resultArray);
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    });
  });
  