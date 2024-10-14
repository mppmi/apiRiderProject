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


router.get('/Orderrider',(req,res)=>{
    const riderID = req.query.riderID; 

    const query = 'SELECT * FROM products WHERE userID = ?';

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
// Delete user and associated file from Firebase Storage
// router.delete('/deleteUser', async (req, res) => {
//   const userID = req.query.userID;

//   const deleteQuery = 'DELETE FROM users WHERE userID = ?';

//   conn.query(deleteQuery, [userID], async (error, results) => {
//     if (error) {
//       return res.status(500).json({ error: 'Database query error' });
//     }

//     if (results.affectedRows > 0) {
//       // Define the folder path
//       const folderPath = `uploads/${userID}`;
//       const folderRef = ref(storage, folderPath);

//       try {
//         // List all items in the folder
//         const resList = await listAll(folderRef);
//         const deletePromises = resList.items.map((itemRef) => deleteObject(itemRef)); // Create an array of delete promises
        
//         await Promise.all(deletePromises); // Wait for all delete operations to complete

//         res.json({ message: 'User and associated files deleted successfully' });
//       } catch (firebaseError) {
//         console.error('Firebase delete error:', firebaseError); // Log the error
//         res.status(500).json({ error: 'Error deleting files from Firebase Storage', details: firebaseError });
//       }
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   });
// });
