import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  CustomerID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  BookID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  initialDate: {
    type: Date,
    required: true,
  },
  deliveryDate: {
    type: Date,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order; 
