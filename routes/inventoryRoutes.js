const express = require("express");
const Inventory = require("../Models/Inventory");
const { verifyToken, checkRole } = require("../middleware/authMiddleware");
const { io } = require("../server");

const router = express.Router();

// **CREATE**: Add new inventory item (Admin only)
router.post("/", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    io.emit("inventoryUpdate", newItem); // Notify clients
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **READ**: Get all inventory items
router.get("/", verifyToken, async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **UPDATE**: Modify inventory item (Admin only)
router.put("/:id", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// **DELETE**: Remove inventory item (Admin only)
router.delete("/:id", verifyToken, checkRole(["admin"]), async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
