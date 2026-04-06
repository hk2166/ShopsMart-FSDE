import express from "express";
import { customerService } from "../services/customerService.js";
import { verifyToken } from "../config/jwt.js";

const router = express.Router();

const authenticateCustomer = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Authentication required" });
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "customer") {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  req.customer = decoded;
  next();
};

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const result = await customerService.register({ name, email, password, phone });
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Email already registered") {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const result = await customerService.login({ email, password });
    res.json(result);
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return res.status(401).json({ error: error.message });
    }
    next(error);
  }
});

router.get("/me", authenticateCustomer, async (req, res, next) => {
  try {
    const customer = await customerService.getById(req.customer.id);
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

export default router;
