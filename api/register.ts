import { conn } from "../dbconnect";
import express from "express";
import { Users } from "../model/users_get_res";
import mysql from "mysql";
import { Rider } from "../model/rider_get_res";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
const bcrypt = require("bcryptjs");

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

// Register Rider route
router.post(
  "/registerR",
  fileUpload.diskLoader.single("file"),
  async (req, res) => {
    const riders: Rider = req.body;

    // Validate passwords
    if (riders.password !== riders.confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }

    // Check for duplicate phone number
    let checkphoneSql = `SELECT phone FROM riders WHERE phone = ?`;
    checkphoneSql = mysql.format(checkphoneSql, [riders.phone]);

    conn.query(checkphoneSql, async (err, results) => {
      if (err) {
        console.error("Error checking phone number:", err);
        return res.status(500).json({ error: "Internal server error." });
      }

      if (results.length > 0) {
        return res.status(409).json({ error: "Phone number already registered." });
      }

      // Upload image to Firebase
      let imageUrl = null;
      if (req.file) {
        try {
          const filename = Date.now() + "-" + Math.round(Math.random() * 10000) + ".png";
          const storageRef = ref(storage, "/images/" + filename);
          const metadata = { contentType: req.file.mimetype };

          const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
          imageUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
          console.error("Error uploading to Firebase:", error);
          return res.status(500).json({ error: "Error uploading image." });
        }
      }


      try {
        const hashedPassword = await bcrypt.hash(riders.password, 10);

        let sql = "INSERT INTO `riders`(`phone`, `name`, `password`, `car`, `photo`) VALUES (?,?,?,?,?)";
        sql = mysql.format(sql, [riders.phone, riders.name, hashedPassword, riders.car, imageUrl]);

        conn.query(sql, (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(501).json({ error: "Error registering user." });
          }

          return res.status(201).json({
            message: "User registered successfully.",
            imageUrl: imageUrl,
          });
        });
      } catch (hashError) {
        console.error("Error hashing password:", hashError);
        return res.status(500).json({ error: "Error registering user." });
      }
    });
  }
);

router.post(
  "/registerU",
  fileUpload.diskLoader.single("file"),
  async (req, res) => {
    const users: Users = req.body;

    // ตรวจสอบรหัสผ่าน
    if (users.password !== users.confirmPassword) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }

    let checkphoneSql = `
  SELECT phone FROM users WHERE phone = ?
`;
    checkphoneSql = mysql.format(checkphoneSql, [users.phone]);

    conn.query(checkphoneSql, async (err, results) => {
      if (err) {
        console.error("Error checking phone number:", err);
        return res.status(600).json({ error: "Internal server error." });
      }

      if (results.length > 0) {
        return res
          .status(409)
          .json({ error: "Phone number already registered." });
      }

      let imageUrl = null;
      if (req.file) {
        try {
          const filename =
            Date.now() + "-" + Math.round(Math.random() * 10000) + ".png";
          const storageRef = ref(storage, "/images/" + filename);
          const metadata = { contentType: req.file.mimetype };

          const snapshot = await uploadBytesResumable(
            storageRef,
            req.file.buffer,
            metadata
          );
          imageUrl = await getDownloadURL(snapshot.ref); 
        } catch (error) {
          console.error("Error uploading to Firebase:", error);
          return res.status(509).json({ error: "Error uploading image." });
        }
      }

      try {
        console.log("User data:", users);

        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(users.password, 10);
        console.log("Hashed password:", hashedPassword);
        console.log("Image URL:", imageUrl);

        let sql =
          "INSERT INTO `users`(`phone`, `name`, `password`, `address`, `lat`, `long`, `photo`) VALUES (?,?,?,?,?,?,?)";

        sql = mysql.format(sql, [
          users.phone,
          users.name,
          hashedPassword,
          users.address,
          users.lat,
          users.long,
          imageUrl,
        ]);

        conn.query(sql, (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res.status(501).json({ error: "Error registering user." });
          }
          const userID = result.insertId;

          return res.status(201).json({
            message: "User registered successfully.",
            imageUrl: imageUrl,
            userID: userID,
          });
        });
      } catch (hashError) {
        console.error("Error hashing password:", hashError);
        return res.status(500).json({ error: "Error registering user 1." });
      }
    });
  }
);
