export const validateLogin = (req, res, next) => {
    const { domainName, password } = req.body;

    if (!domainName || !password) {
        return res.status(400).json({
            success: false,
            message: 'Domain name and password are required',
        });
    }

    next();
};

export const validateCreateOpening = (req, res, next) => {
    const { title, domain, workType, numberOfSlots, preText, aboutRole, skillsRequired } = req.body;

    // Check required fields
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
            message: 'Missing required fields for opening creation',
        });
    }

    // Validate workType enum
    const validWorkTypes = ['HYBRID', 'REMOTE', 'ONSITE'];
    if (!validWorkTypes.includes(workType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid workType. Must be HYBRID, REMOTE, or ONSITE',
        });
    }

    // Validate numberOfSlots is a positive number
    const slots = parseInt(numberOfSlots);
    if (isNaN(slots) || slots < 1) {
        return res.status(400).json({
            success: false,
            message: 'numberOfSlots must be a positive number',
        });
    }

    next();
};

export const validateCreateForm = (req, res, next) => {
    const { openingId, customFields } = req.body;

    if (!openingId) {
        return res.status(400).json({
            success: false,
            message: 'openingId is required',
        });
    }

    if (customFields && !Array.isArray(customFields)) {
        return res.status(400).json({
            success: false,
            message: 'customFields must be an array',
        });
    }

    // Validate each custom field
    if (customFields && customFields.length > 0) {
        const validInputTypes = [
            'SHORT_ANSWER',
            'LONG_ANSWER',
            'MULTIPLE_CHOICE',
            'MULTIPLE_CORRECT',
            'UPLOAD_DOC',
        ];

        for (const field of customFields) {
            if (!field.fieldTitle || !field.inputType || field.order === undefined) {
                return res.status(400).json({
                    success: false,
                    message: 'Each custom field must have fieldTitle, inputType, and order',
                });
            }

            if (!validInputTypes.includes(field.inputType)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid inputType: ${field.inputType}`,
                });
            }
        }
    }

    next();
};

export const validateSubmitApplication = (req, res, next) => {
    const { openingId, formId, name, yearOfStudy, phoneNumber, email, branch } = req.body;

    // Check required fields
    if (!openingId || !formId || !name || !yearOfStudy || !phoneNumber || !email || !branch) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields for application submission',
        });
    }

    // Validate yearOfStudy enum
    const validYears = ['FIRST', 'SECOND', 'THIRD', 'FOURTH'];
    if (!validYears.includes(yearOfStudy)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid yearOfStudy. Must be FIRST, SECOND, THIRD, or FOURTH',
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format',
        });
    }

    next();
};
