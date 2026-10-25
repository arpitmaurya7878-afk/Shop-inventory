import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "https://shop-inventory-zt2o.onrender.com" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req,res) => res.json({ status:"ok", app:"Janta Auto Parts API" }));
app.use("/api/products", productRoutes);
app.use((req,res) => res.status(404).json({ message:`Route not found: ${req.method} ${req.originalUrl}` }));
app.use((err,_req,res,_next) => {
  console.error(err);
  if (err.name === "ValidationError") return res.status(400).json({ message:Object.values(err.errors)[0]?.message || "Validation failed" });
  if (err.name === "CastError") return res.status(400).json({ message:"Invalid product ID" });
  res.status(500).json({ message:"Internal server error" });
});
const port = process.env.PORT || 8000;
try {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI missing. Configure backend/.env");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
  app.listen(port, () => console.log(`API running at http://localhost:${port}`));
} catch (e) { console.error("Startup failed:",e.message); process.exit(1); }
