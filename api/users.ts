import { conn } from "../dbconnect"; 
import express from "express";
import mysql from "mysql";
const bcrypt = require("bcryptjs");

export const router = express.Router();

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
