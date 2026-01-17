export const createOpening = async (req, res) => {
    // POST /api/openings
    // Role: ADMIN, LEADER
    // Body: { title, domain, workType, numberOfSlots, preText, aboutRole, skillsRequired, extraInfo }
    // Returns: { opening }
};

export const getAllOpenings = async (req, res) => {
    // GET /api/openings
    // Public route (for students)
    // Query: ?isActive=true&domain=Technical&workType=REMOTE
    // Returns: { openings: [], total }
};

export const getOpeningById = async (req, res) => {
    // GET /api/openings/:id
    // Public route (for students)
    // Also increments view count
    // Returns: { opening }
};

export const getOpeningDetails = async (req, res) => {
    // GET /api/openings/:id/details
    // Role: ADMIN, LEADER
    // Returns: { opening, form, totalApplications, totalViews }
};

export const updateOpening = async (req, res) => {
    // PUT /api/openings/:id
    // Role: ADMIN, LEADER (only creator or admin)
    // Body: { title, domain, workType, numberOfSlots, preText, aboutRole, skillsRequired, extraInfo, isActive }
    // Returns: { opening }
};

export const deleteOpening = async (req, res) => {
    // DELETE /api/openings/:id
    // Role: ADMIN, LEADER (only creator or admin)
    // Returns: { message }
};

export const toggleOpeningStatus = async (req, res) => {
    // PATCH /api/openings/:id/toggle-status
    // Role: ADMIN, LEADER (only creator or admin)
    // Returns: { opening }
};

export const getOpeningStats = async (req, res) => {
    // GET /api/openings/:id/stats
    // Role: ADMIN, LEADER
    // Returns: { views, totalApplications, applicationsByBranch, applicationsByYear }
};
