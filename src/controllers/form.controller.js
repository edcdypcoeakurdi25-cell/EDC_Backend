import prisma from '../config/prisma.js';

// CREATE Form with Custom Fields
export const createForm = async (req, res) => {
  try {
    const { openingId, hasPriorExp, customFields } = req.body;
    const createdById = req.user.id;

    // Check if opening exists
    const opening = await prisma.opening.findUnique({
      where: { id: openingId }
    });

    if (!opening) {
      return res.status(404).json({
        success: false,
        message: 'Opening not found'
      });
    }

    // Check if form already exists for this opening
    const existingForm = await prisma.form.findUnique({
      where: { openingId }
    });

    if (existingForm) {
      return res.status(400).json({
        success: false,
        message: 'Form already exists for this opening'
      });
    }

    // Create form with custom fields in a transaction
    const form = await prisma.$transaction(async (tx) => {
      // Create the form
      const newForm = await tx.form.create({
        data: {
          openingId,
          hasPriorExp: hasPriorExp ?? true,
          createdById
        }
      });

      // Create custom fields if provided
      if (customFields && Array.isArray(customFields) && customFields.length > 0) {
        const fieldsToCreate = customFields.map((field, index) => ({
          formId: newForm.id,
          fieldTitle: field.fieldTitle,
          inputType: field.inputType,
          isRequired: field.isRequired ?? false,
          options: field.options || null,
          order: field.order ?? index
        }));

        await tx.formField.createMany({
          data: fieldsToCreate
        });
      }

      // Fetch the complete form with fields
      const completeForm = await tx.form.findUnique({
        where: { id: newForm.id },
        include: {
          customFields: {
            orderBy: { order: 'asc' }
          },
          opening: {
            select: {
              id: true,
              title: true,
              domain: true,
              workType: true
            }
          }
        }
      });

      return completeForm;
    });

    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      form
    });

  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create form',
      error: error.message
    });
  }
};

// GET Form by Opening ID (Public route for students)
export const getFormByOpeningId = async (req, res) => {
  try {
    const { openingId } = req.params;

    const form = await prisma.form.findUnique({
      where: { openingId },
      include: {
        customFields: {
          orderBy: { order: 'asc' }
        },
        opening: {
          select: {
            id: true,
            title: true,
            domain: true,
            workType: true,
            isActive: true,
            aboutRole: true,
            skillsRequired: true
          }
        }
      }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found for this opening'
      });
    }

    // Check if opening is active
    if (!form.opening.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This opening is no longer accepting applications'
      });
    }

    res.status(200).json({
      success: true,
      form
    });

  } catch (error) {
    console.error('Error fetching form by opening:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch form',
      error: error.message
    });
  }
};

// GET Form by ID
export const getFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await prisma.form.findUnique({
      where: { id },
      include: {
        customFields: {
          orderBy: { order: 'asc' }
        },
        opening: {
          select: {
            id: true,
            title: true,
            domain: true,
            workType: true,
            isActive: true,
            numberOfSlots: true,
            aboutRole: true,
            skillsRequired: true,
            extraInfo: true
          }
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.status(200).json({
      success: true,
      form
    });

  } catch (error) {
    console.error('Error fetching form by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch form',
      error: error.message
    });
  }
};

// UPDATE Form
export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const { hasPriorExp } = req.body;

    // Check if form exists
    const existingForm = await prisma.form.findUnique({
      where: { id }
    });

    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Update form
    const form = await prisma.form.update({
      where: { id },
      data: { hasPriorExp },
      include: {
        customFields: {
          orderBy: { order: 'asc' }
        },
        opening: {
          select: {
            id: true,
            title: true,
            domain: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Form updated successfully',
      form
    });

  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update form',
      error: error.message
    });
  }
};

// DELETE Form
export const deleteForm = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if form exists
    const existingForm = await prisma.form.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    if (!existingForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    // Optionally warn if there are applications
    if (existingForm._count.applications > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete form. There are ${existingForm._count.applications} applications associated with it.`
      });
    }

    // Delete form (cascade will delete custom fields automatically)
    await prisma.form.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Form and associated fields deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete form',
      error: error.message
    });
  }
};