import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    
    discount: { type: Number, default: 0 }, // percentage
     stock: { type: Number, default: 0 }, // ✅ new field
    image: { type: String }, // image path
    category: {
      type: String,
      enum: ["indoor", "outdoor", "flowering", "succulent", "seeds", "pots"],
      required: true,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
