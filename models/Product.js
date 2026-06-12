const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, enum: ["mens", "womens", "accessories", "unisex"], required: true },
    images: [{ type: String }], // URLs
    sizes: [{ type: String, enum: ["XS", "S", "M", "L", "XL", "XXL"] }],
    stock: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 }, // % off
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Virtual for discounted price
productSchema.virtual("discountedPrice").get(function () {
  if (this.discount > 0) {
    return +(this.price * (1 - this.discount / 100)).toFixed(2);
  }
  return this.price;
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
