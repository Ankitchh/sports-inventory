const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  sportsName: String,
  equipmentName: String,
  dateOfPurchase: { type: Date, default: Date.now },
  brandName: String,
  quantity: Number,
  expiryDate: { type: Date, default: null },
});

module.exports = mongoose.model("Inventory", inventorySchema);
