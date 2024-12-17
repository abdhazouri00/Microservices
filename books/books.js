import express from "express";
import mongoose from "mongoose";
import { configDotenv } from "dotenv";
import bodyParser from "body-parser";
import Book from "./Book.js";

// Load environment variables
configDotenv({ path: "../config.env" });

// Database connection
const DB = process.env.BOOKDATABASE;

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.error("Database connection error:", err));

const app = express();

// Middleware for parsing body data
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("This is the books service");
});

// Create book
app.post("/book", (req, res) => {
  var newBook = {
    title: req.body.title,
    author: req.body.author,
    pagesNumber: req.body.pagesNumber,
    publisher: req.body.publisher,
  };

  var book = new Book(newBook);
  book
    .save()
    .then(() => {
      console.log("New book created!");
      res.send("A new book created with success!");
    })
    .catch((error) => {
      res.status(500).json({ message: "Error creating book", error });
    });
});

// Get all books
app.get("/books", (req, res) => {
  Book.find()
    .then((books) => {
      res.json(books);
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching books", error: err });
    });
});

app.get("/book/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => {
      if (book) {
        res.json(book);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error fetching book", error: err });
    });
});

app.delete("/book:id", (req, res) => {
  Book.findOneAndDelete(req.params.id)
    .then(() => {
      res.send("Book deleted");
    })
    .catch((err) => {
      throw err;
    });
});

app.listen(4545, () => {
  console.log("Up and running! -- This is our Books service");
});
