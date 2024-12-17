// app.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";
import Customer from "./Customer.js";

configDotenv({ path: "../config.env" });

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());

// Environment variable for the database
const DB = process.env.CUSTOMERDATABASE;

// Connect to the database
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

// Create a customer
app.post("/customer", (req, res) => {
  const newCustomer = {
    name: req.body.name,
    age: req.body.age,
    address: req.body.address,
  };
  const customer = new Customer(newCustomer);
  customer
    .save()
    .then(() => res.send("Customer created"))
    .catch((err) =>
      res.status(500).json({ message: "Error creating customer", error: err })
    );
});

// Get all customers
app.get("/customers", (req, res) => {
  Customer.find()
    .then((customers) => res.json(customers))
    .catch((err) =>
      res.status(500).json({ message: "Error fetching customers", error: err })
    );
});

// Get a customer by ID
app.get("/customers/:id", (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (customer) res.json(customer);
      else res.status(404).send("Customer not found!");
    })
    .catch((err) =>
      res.status(500).json({ message: "Error fetching customer", error: err })
    );
});

// Delete a customer by ID
app.delete("/customers/:id", (req, res) => {
  Customer.findByIdAndRemove(req.params.id)
    .then(() => res.send("Customer deleted with success!"))
    .catch((err) =>
      res.status(500).json({ message: "Error deleting customer", error: err })
    );
});

// Start the server
app.listen("5555", () => {
  console.log("Up and running - Customers service");
});
