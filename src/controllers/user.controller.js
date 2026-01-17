export const getAllUsers = async (req, res) => {
    // GET /api/users
    // Query: ?role=ADMIN&isActive=true
    // Returns: { users: [], total }
};

export const getUserById = async (req, res) => {
    // GET /api/users/:id
    // Returns: { user }
};

export const updateUser = async (req, res) => {
    // PUT /api/users/:id
    // Body: { name, role, isActive }
    // Returns: { user }
};

export const deleteUser = async (req, res) => {
    // DELETE /api/users/:id
    // Returns: { message }
};
