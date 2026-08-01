const supabase = require("../config/supabase");

exports.uploadProductImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded." });
        }

    const fileName = `${Date.now()}_${req.file.originalname}`;
    const { error } = await supabase.storage
        .from("products")
        .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false, // Prevent overwriting existing files
        });

        if (error) throw error;
        
        const { data } = supabase.storage.from("products").getPublicUrl(fileName);
        return res.json({ success: true, imageUrl: data.publicUrl });
    } 
            
    catch (err) {
        console.error("Error uploading image:", err);
        return res.status(500).json({ success: false, message: "Failed to upload image." });
    }
};

