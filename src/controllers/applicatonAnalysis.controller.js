export const getDashboardStats = async (req, res) => {
    // GET /api/dashboard/stats
    // Role: ADMIN, LEADER
    // Returns: {
    //   totalOpenings,
    //   activeOpenings,
    //   totalApplications,
    //   recentApplications: [],
    //   topOpenings: [{ opening, applicationCount }]
    // }
};

export const getMyOpenings = async (req, res) => {
    // GET /api/dashboard/my-openings
    // Role: ADMIN, LEADER
    // Returns: { openings: [] } // Openings created by logged-in user
};

export const getSummaryView = async (req, res) => {
    // GET /api/applications/analysis/:openingId/summary
    // Role: ADMIN, LEADER
    // Returns: {
    //   totalApplications,
    //   fieldSummaries: [
    //     { fieldTitle, fieldType, responses: [{ value, count }] }
    //   ],
    //   branchDistribution: { CS: 10, IT: 5 },
    //   yearDistribution: { FIRST: 3, SECOND: 7 }
    // }
};

export const getQuestionView = async (req, res) => {
    // GET /api/applications/analysis/:openingId/questions
    // Role: ADMIN, LEADER
    // Query: ?fieldId=xxx
    // Returns: {
    //   field: { id, fieldTitle, inputType },
    //   responses: [
    //     { applicationId, applicantName, responseValue, submittedAt }
    //   ]
    // }
};

export const getIndividualView = async (req, res) => {
    // GET /api/applications/analysis/:openingId/individual/:applicationId
    // Role: ADMIN, LEADER
    // Returns: {
    //   application: { all fixed fields },
    //   responses: [
    //     { fieldTitle, inputType, responseValue, fileUrl }
    //   ]
    // }
};

export const exportApplicationsCSV = async (req, res) => {
    // GET /api/applications/analysis/:openingId/export
    // Role: ADMIN, LEADER
    // Returns: CSV file download
};
