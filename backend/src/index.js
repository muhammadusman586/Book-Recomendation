import express from "express";
import "dotenv/config"
import { connectDB } from "./lib/db.js";



const app=express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
  connectDB();
});
