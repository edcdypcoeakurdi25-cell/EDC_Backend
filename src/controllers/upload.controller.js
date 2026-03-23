import fs from 'fs';
import path from 'path';

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        return res.status(200).json({
            fileUrl,
            fileName: req.file.originalname,
            success: true,
            message: 'File uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({ success: false, message: 'Failed to process file upload.' });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const filePath = path.join(process.cwd(), 'uploads', fileId);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.status(200).json({ success: true, message: 'File deleted successfully' });
        } else {
            return res.status(404).json({ success: false, message: 'File not found' });
        }
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, message: 'Failed to delete file' });
    }
};
