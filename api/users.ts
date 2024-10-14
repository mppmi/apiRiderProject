import { conn } from "../dbconnect"; 
import express from "express";
import mysql from "mysql";
const bcrypt = require("bcryptjs");
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const router = express.Router();
// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAiVnY-8Ajak4xVeQNLzynr8skqCgNFulg',
  appId: '1:259988227090:android:db894289cac749ff6c04cb',
  messagingSenderId: '259988227090',
  projectId: 'project-rider-1b5ac',
  storageBucket: 'project-rider-1b5ac.appspot.com',
};

// Initialize Firebase
initializeApp(firebaseConfig);
const storage = getStorage();

// Multer setup for file uploads
class FileMiddleware {
  filename = "";

  public readonly diskLoader = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 67108864 }, // 64MB limit
  });
}
const fileUpload = new FileMiddleware();

router.get('/users', (req, res) => {
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

 
