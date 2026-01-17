export const uploadFile = async (req, res) => {
    // POST /api/upload
    // Public route (students uploading documents)
    // Body: multipart/form-data with file
    // Returns: { fileUrl, fileName }
};

export const deleteFile = async (req, res) => {
    // DELETE /api/upload/:fileId
    // Role: ADMIN
    // Returns: { message }
};
