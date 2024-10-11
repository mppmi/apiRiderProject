
import { conn } from "../dbconnect";
import express from "express";
import { Users } from "../model/users_get_res";
import mysql from "mysql";

export const router = express.Router();
const bcrypt = require('bcryptjs');


router.post("/loginU", (req, res) => {
    const { phone, password } = req.body;

    const sqlUser = "SELECT * FROM users WHERE phone = ?";

    conn.query(sqlUser, [phone], async (err, userResult) => {
        if (err) {
            res.status(500).json({ message: "An error occurred" });
            return;
        }

        if (userResult.length > 0) {
            const user = userResult[0];
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.json({
                    message: "User login successful",
                    user : user
                });
                return;
            } else {
                res.status(401).json({ message: "Invalid phone or password" });
                return;
            }
        }
    });
});

router.post("/loginR", (req, res) => {
    const { phone, password } = req.body;

    const sqlRider = "SELECT * FROM riders WHERE phone = ?";

        conn.query(sqlRider, [phone], async (err, riderResult) => {
            if (err) {
                res.status(500).json({ message: "An error occurred" });
                return;
            }

            if (riderResult.length > 0) {
                const rider = riderResult[0];
                const match = await bcrypt.compare(password, rider.password);
                if (match) {
                    res.json({
                        message: "Rider login successful",
                        rider:rider
                    });
                } else {
                    res.status(401).json({ message: "Invalid phone or password" });
                }
            } else {
                res.status(404).json({ message: "No user found with that phone number" });
            }
        });
    });