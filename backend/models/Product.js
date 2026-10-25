import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true, maxlength: 120 },
    supplierName: { type: String, required: true, trim: true, maxlength: 120 },
    mrp: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: null, min: 0, max: 100 },
    finalSellingPrice: { type: Number, required: true, min: 0 },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock quantity must be a whole number",
      },
    },
  },
  { timestamps: true },
);
export default mongoose.model("Product", schema);
