import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pagesNumber: {
    type: Number,
    required: false,
  },
  publisher: {
    type: String,
    required: false,
  },
});

export default mongoose.model("Book", BookSchema);