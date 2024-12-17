import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";

// Load environment variables
configDotenv({ path: "../config.env" });

const DB = process.env.ORDERSDATABASE;

const app = express();

app.use(bodyParser.json());

// Connect to MongoDB database
mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

// Import Order model
import Order from "./Order.js"; // Use import here, assuming Order.js is the model file

// Create new order
app.post("/order", (req, res) => {
  const newOrder = {
    CustomerID: new mongoose.Types.ObjectId(req.body.CustomerID),
    BookID:new mongoose.Types.ObjectId(req.body.BookID),
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate,
  };

  const order = new Order(newOrder);
  order
    .save()
    .then(() => {
      res.send("Order created successfully!");
    })
    .catch((err) => {
      res.status(500).json({ message: "Error creating order", error: err });
    });
});

// Get all orders
app.get("/orders", (req, res) => {
  Order.find()
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching orders", error: err });
    });
});

app.get("/order/:id", (req, res) => {
  Order.findById(req.params.id).then((order) => {
    if (order) {
      axios
        .get("http://localhost:5555/customer/" + Order.CustomerID)
        .then((response) => {
          var orderObject = { customerName: response.data.name, bookTitle: "" };

          axios
            .get("http://localhost:4545/" + order.BookID)
            .then((response) => {
              orderObject.bookTitle = response.data.title;
              res.json(orderObject);
            });
        });
    } else {
      res.send("Invalid Oreder");
    }
  });
});

// Start the server on port 7777
app.listen(7777, () => {
  console.log("Up and running - Orders service");
});
