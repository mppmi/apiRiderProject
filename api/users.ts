import { conn } from "../dbconnect"; 
import express from "express";
import mysql from "mysql";
const bcrypt = require("bcryptjs");
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, deleteObject, listAll } from "firebase/storage";

export const router = express.Router();

const firebaseConfig = {
  apiKey: 'AIzaSyAiVnY-8Ajak4xVeQNLzynr8skqCgNFulg',
  appId: '1:259988227090:android:db894289cac749ff6c04cb',
  messagingSenderId: '259988227090',
  projectId: 'project-rider-1b5ac',
  storageBucket: 'project-rider-1b5ac.appspot.com',
};

initializeApp(firebaseConfig);
const storage = getStorage();

class FileMiddleware {
  filename = "";

  public readonly diskLoader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 67108864 }, 
  });
}
const fileUpload = new FileMiddleware();

router.get('/userPhone', (req, res) => {
    const userID = req.query.userID; 

    const query = 'SELECT * FROM users WHERE userID != ?';

    conn.query(query, [userID], (error, results) => {
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

// Get specific user by userID
router.get('/user', (req, res) => {
    const userID = req.query.userID; 

    const query = 'SELECT * FROM users WHERE userID = ?';

    conn.query(query, [userID], (error, results) => {
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

// Search for user by phone number
router.get('/searchPhone', (req, res) => {
    const phone = req.query.phone; 

    const query = 'SELECT * FROM users WHERE phone = ?';

    conn.query(query, [phone], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'No user found' });
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
  userPhoto: string;
  address: string;
  products: Product[];
}

router.get('/ordersent/:userIDSender', (req, res) => {
  const userIDSender: string = req.params.userIDSender; 
  const query = `
    SELECT 
        p.orderID,
        u.userID,   
        u.name, 
        u.phone, 
        u.photo AS userPhoto, 
        u.address, 
        p.productID, 
        p.photo AS productPhoto, 
        p.detail 
    FROM 
        users u 
    JOIN 
        products p ON u.userID = p.userID 
    WHERE 
        p.userIDSender = ?
  `;

  conn.query(query, [userIDSender], (error, results: any[]) => {
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
interface Products {
  productID: number;
  productPhoto: string;
  detail: string;
}

interface Orders {
  orderID: number;
  userIDSender: number;  
  name: string;
  phone: string;
  userPhoto: string;
  address: string;
  products: Product[];
}

router.get('/orderreceiver/:userID', (req, res) => {
  const userID: number = parseInt(req.params.userID); 
  const query = `
    SELECT 
        p.orderID,
        p.userIDSender,   
        u.name, 
        u.phone, 
        u.photo AS userPhoto, 
        u.address, 
        p.productID, 
        p.photo AS productPhoto, 
        p.detail 
    FROM 
         users u  
    JOIN 
      products p ON u.userID = p.userID 
    WHERE 
        p.userID = ? 
  `;

  conn.query(query, [userID], (error, results: any[]) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    if (results.length > 0) {
      const orders: { [key: number]: Orders } = {};

      results.forEach(item => {
        const orderID = item.orderID;

        if (!orders[orderID]) {
          orders[orderID] = {
            orderID: orderID,
            userIDSender: item.userIDSender,
            name: item.name,
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
      const resultArray: Orders[] = Object.values(orders);
      res.status(200).json(resultArray);
    } else {
      res.status(404).json({ message: 'No orders found for this user.' });
    }
  });
});
