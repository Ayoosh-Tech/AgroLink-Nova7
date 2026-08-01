const express = require("express");
const uploadController = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const { success } = require("../utils/apiResponse");

const router = express.Router();
router.get("/products", (req, res) => {
    res.json({
        success: true,
        message: "Upload route is working"
    });
});


router.post("/products", upload.single("image"), uploadController.uploadProductImage);

module.exports = router;
