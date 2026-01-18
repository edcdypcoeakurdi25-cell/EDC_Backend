import prisma from '../config/prisma.js';

// ADD Form Field
export const addFormField = async (req, res) => {
  try {
    const {
      formId,
      fieldTitle,
      inputType,
      isRequired,
      options,
      order
    } = req.body;

    // Validate required fields
    if (!formId || !fieldTitle || !inputType) {
      return res.status(400).json({
        success: false,
        message: 'formId, fieldTitle, and inputType are required'
      });
    }

    // Verify form exists
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        customFields: true
      }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // If order not provided, set it to the next available position
    const fieldOrder = order !== undefined ? order : form.customFields.length;

    // Create form field
    const formField = await prisma.formField.create({
      data: {
        formId,
        fieldTitle,
        inputType,
        isRequired: isRequired ?? false,
        options: options || null,
        order: fieldOrder
      }
    });

    res.status(201).json({
      success: true,
      message: 'Form field added successfully',
      formField
    });

  } catch (error) {
    console.error('Error adding form field:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add form field',
      error: error.message
    });
  }
};

// UPDATE Form Field
export const updateFormField = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      fieldTitle,
      inputType,
      isRequired,
      options,
      order
    } = req.body;

    // Check if form field exists
    const existingField = await prisma.formField.findUnique({
      where: { id }
    });

    if (!existingField) {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      });
    }

    // Prepare update data (only update provided fields)
    const updateData = {};
    if (fieldTitle !== undefined) updateData.fieldTitle = fieldTitle;
    if (inputType !== undefined) updateData.inputType = inputType;
    if (isRequired !== undefined) updateData.isRequired = isRequired;
    if (options !== undefined) updateData.options = options;
    if (order !== undefined) updateData.order = order;

    // Update form field
    const formField = await prisma.formField.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: 'Form field updated successfully',
      formField
    });

  } catch (error) {
    console.error('Error updating form field:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update form field',
      error: error.message
    });
  }
};

// DELETE Form Field
export const deleteFormField = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if form field exists
    const existingField = await prisma.formField.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            responses: true
          }
        }
      }
    });

    if (!existingField) {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      });
    }

    // Optionally warn if there are responses
    if (existingField._count.responses > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete field. There are ${existingField._count.responses} responses associated with it.`
      });
    }

    // Delete form field
    await prisma.formField.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Form field deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting form field:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Form field not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete form field',
      error: error.message
    });
  }
};

// REORDER Form Fields
export const reorderFormFields = async (req, res) => {
  try {
    const { formId, fieldOrders } = req.body;
    // fieldOrders format: [{ fieldId: 'id1', order: 0 }, { fieldId: 'id2', order: 1 }]

    // Validate input
    if (!formId || !Array.isArray(fieldOrders) || fieldOrders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'formId and fieldOrders array are required'
      });
    }

    // Verify form exists
    const form = await prisma.form.findUnique({
      where: { id: formId }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Update all fields in a transaction
    await prisma.$transaction(
      fieldOrders.map(({ fieldId, order }) =>
        prisma.formField.update({
          where: { id: fieldId },
          data: { order }
        })
      )
    );

    // Fetch updated fields
    const updatedFields = await prisma.formField.findMany({
      where: { formId },
      orderBy: { order: 'asc' }
    });

    res.status(200).json({
      success: true,
      message: 'Form fields reordered successfully',
      formFields: updatedFields
    });

  } catch (error) {
    console.error('Error reordering form fields:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'One or more form fields not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to reorder form fields',
      error: error.message
    });
  }
};