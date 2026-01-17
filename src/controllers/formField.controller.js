export const addFormField = async (req, res) => {
    // POST /api/form-fields
    // Role: ADMIN, LEADER
    // Body: { formId, fieldTitle, inputType, isRequired, options, order }
    // Returns: { formField }
};

export const updateFormField = async (req, res) => {
    // PUT /api/form-fields/:id
    // Role: ADMIN, LEADER
    // Body: { fieldTitle, inputType, isRequired, options, order }
    // Returns: { formField }
};

export const deleteFormField = async (req, res) => {
    // DELETE /api/form-fields/:id
    // Role: ADMIN, LEADER
    // Returns: { message }
};

export const reorderFormFields = async (req, res) => {
    // PATCH /api/form-fields/reorder
    // Role: ADMIN, LEADER
    // Body: { formId, fieldOrders: [{ fieldId, order }] }
    // Returns: { message }
};
