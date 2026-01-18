export const validateLogin = (req, res, next) => {
    // Validate login request body
};

export const validateCreateOpening = (req, res, next) => {
    // Validate opening creation

    const {
    title,
    domain,
    workType,
    numberOfSlots,
    preText,
    aboutRole,
    skillsRequired,
} = req.body;

  if (
    !title ||
    !domain ||
    !workType ||
    !numberOfSlots ||
    !preText ||
    !aboutRole ||
    !skillsRequired
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields for opening creation",
    });
  }
    next();
};

export const validateCreateForm = (req, res, next) => {
    // Validate form creation
};

export const validateSubmitApplication = (req, res, next) => {
    // Validate application submission
};
