export const submitApplication = async (req, res) => {
    // POST /api/applications
    // Public route (students)
    // Body: {
    //   openingId, formId, name, yearOfStudy, phoneNumber, email, branch,
    //   priorExperience, fieldResponses: [{ fieldId, responseValue, fileUrl }]
    // }
    // Returns: { application }
};

export const getAllApplications = async (req, res) => {
    // GET /api/applications
    // Role: ADMIN, LEADER
    // Query: ?openingId=xxx&yearOfStudy=SECOND&branch=CS
    // Returns: { applications: [], total }
};

export const getApplicationById = async (req, res) => {
    // GET /api/applications/:id
    // Role: ADMIN, LEADER
    // Returns: { application with fieldResponses }
};

export const getApplicationsByOpening = async (req, res) => {
    // GET /api/applications/opening/:openingId
    // Role: ADMIN, LEADER
    // Query: ?yearOfStudy=SECOND&branch=CS
    // Returns: { applications: [], total }
};

export const deleteApplication = async (req, res) => {
    // DELETE /api/applications/:id
    // Role: ADMIN
    // Returns: { message }
};
