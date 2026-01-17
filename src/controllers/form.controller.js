export const createForm = async (req, res) => {
    // POST /api/forms
    // Role: ADMIN, LEADER
    // Body: { openingId, hasPriorExp, customFields: [{ fieldTitle, inputType, isRequired, options, order }] }
    // Returns: { form }
};

export const getFormByOpeningId = async (req, res) => {
    // GET /api/forms/opening/:openingId
    // Public route (for students to view form)
    // Returns: { form with customFields }
};

export const getFormById = async (req, res) => {
    // GET /api/forms/:id
    // Role: ADMIN, LEADER
    // Returns: { form with customFields }
};

export const updateForm = async (req, res) => {
    // PUT /api/forms/:id
    // Role: ADMIN, LEADER (only creator or admin)
    // Body: { hasPriorExp }
    // Returns: { form }
};

export const deleteForm = async (req, res) => {
    // DELETE /api/forms/:id
    // Role: ADMIN, LEADER (only creator or admin)
    // Returns: { message }
};
