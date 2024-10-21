import { conn } from "../dbconnect";
import express from "express";
import { Users } from "../model/users_get_res";
import mysql from "mysql";

export const router = express.Router();

router.delete("/deleteU/:usersID", async (req, res) => {
    const usersID = req.params.usersID;
  
    let deleteUserSql = 'DELETE FROM users WHERE userID = ?';
      deleteUserSql = mysql.format(deleteUserSql, [usersID]);
  
      conn.query(deleteUserSql, (err, result) => {
        if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).json({ error: "Error deleting user." });
        }
  
        return res.status(200).json({ message: "User and image deleted successfully." });
      });
  });

  router.delete("/deleteR/:usersID", async (req, res) => {
    const usersID = req.params.usersID;
  
    let deleteUserSql = 'DELETE FROM riders WHERE riderID = ?';
      deleteUserSql = mysql.format(deleteUserSql, [usersID]);
  
      conn.query(deleteUserSql, (err, result) => {
        if (err) {
          console.error("Error deleting user:", err);
          return res.status(500).json({ error: "Error deleting user." });
        }
  
        return res.status(200).json({ message: "User and image deleted successfully." });
      });
  });
