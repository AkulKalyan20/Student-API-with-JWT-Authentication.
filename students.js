const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply JWT authentication to all student routes
router.use(authenticateToken);

// Validation middleware
const validateStudent = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('age').isInt({ min: 16, max: 100 }).withMessage('Age must be between 16 and 100'),
  body('grade').isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']).withMessage('Invalid grade level'),
  body('major').trim().isLength({ min: 2 }).withMessage('Major must be at least 2 characters long'),
  body('gpa').isFloat({ min: 0.0, max: 4.0 }).withMessage('GPA must be between 0.0 and 4.0'),
  body('enrollmentDate').isISO8601().withMessage('Enrollment date must be a valid date')
];

const validateStudentUpdate = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('age').optional().isInt({ min: 16, max: 100 }).withMessage('Age must be between 16 and 100'),
  body('grade').optional().isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']).withMessage('Invalid grade level'),
  body('major').optional().trim().isLength({ min: 2 }).withMessage('Major must be at least 2 characters long'),
  body('gpa').optional().isFloat({ min: 0.0, max: 4.0 }).withMessage('GPA must be between 0.0 and 4.0'),
  body('enrollmentDate').optional().isISO8601().withMessage('Enrollment date must be a valid date')
];

// @route   GET /api/students
// @desc    Get all students (with optional search parameters)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { name, major, grade } = req.query;
    
    let students;
    if (name || major || grade) {
      // Search students with filters
      students = await Student.search({ name, major, grade });
    } else {
      // Get all students
      students = await Student.findAll();
    }

    res.json({
      message: 'Students retrieved successfully',
      count: students.length,
      students
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      error: 'Failed to retrieve students',
      message: 'An error occurred while retrieving students'
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get a specific student by ID
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        error: 'Student not found',
        message: `No student found with ID ${id}`
      });
    }

    res.json({
      message: 'Student retrieved successfully',
      student
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      error: 'Failed to retrieve student',
      message: 'An error occurred while retrieving the student'
    });
  }
});

// @route   POST /api/students
// @desc    Create a new student
// @access  Private
router.post('/', validateStudent, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const studentData = req.body;
    const newStudent = await Student.create(studentData);

    res.status(201).json({
      message: 'Student created successfully',
      student: newStudent
    });

  } catch (error) {
    if (error.message === 'Student with this email already exists') {
      return res.status(409).json({
        error: 'Student creation failed',
        message: error.message
      });
    }

    console.error('Create student error:', error);
    res.status(500).json({
      error: 'Failed to create student',
      message: 'An error occurred while creating the student'
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update a student by ID
// @access  Private
router.put('/:id', validateStudentUpdate, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    const updatedStudent = await Student.update(id, updateData);

    res.json({
      message: 'Student updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({
        error: 'Update failed',
        message: error.message
      });
    }

    console.error('Update student error:', error);
    res.status(500).json({
      error: 'Failed to update student',
      message: 'An error occurred while updating the student'
    });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete a student by ID
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await Student.delete(id);

    res.json({
      message: 'Student deleted successfully',
      student: deletedStudent
    });

  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({
        error: 'Delete failed',
        message: error.message
      });
    }

    console.error('Delete student error:', error);
    res.status(500).json({
      error: 'Failed to delete student',
      message: 'An error occurred while deleting the student'
    });
  }
});

// @route   GET /api/students/search/:query
// @desc    Search students by name, major, or grade
// @access  Private
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const students = await Student.search({ 
      name: query, 
      major: query, 
      grade: query 
    });

    res.json({
      message: 'Search completed successfully',
      query,
      count: students.length,
      students
    });

  } catch (error) {
    console.error('Search students error:', error);
    res.status(500).json({
      error: 'Search failed',
      message: 'An error occurred while searching students'
    });
  }
});

module.exports = router; 