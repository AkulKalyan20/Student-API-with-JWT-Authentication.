// In-memory storage for students (in production, use a database)
let students = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@student.edu',
    age: 20,
    grade: 'Sophomore',
    major: 'Computer Science',
    gpa: 3.8,
    enrollmentDate: '2023-09-01',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@student.edu',
    age: 19,
    grade: 'Freshman',
    major: 'Mathematics',
    gpa: 3.9,
    enrollmentDate: '2023-09-01',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class Student {
  static async findAll() {
    return students;
  }

  static async findById(id) {
    return students.find(student => student.id === parseInt(id));
  }

  static async findByEmail(email) {
    return students.find(student => student.email === email);
  }

  static async create(studentData) {
    const { name, email, age, grade, major, gpa, enrollmentDate } = studentData;
    
    // Check if student with email already exists
    const existingStudent = await this.findByEmail(email);
    if (existingStudent) {
      throw new Error('Student with this email already exists');
    }

    // Create new student
    const newStudent = {
      id: students.length + 1,
      name,
      email,
      age: parseInt(age),
      grade,
      major,
      gpa: parseFloat(gpa),
      enrollmentDate,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    students.push(newStudent);
    return newStudent;
  }

  static async update(id, updateData) {
    const studentIndex = students.findIndex(student => student.id === parseInt(id));
    
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    // Update student data
    students[studentIndex] = {
      ...students[studentIndex],
      ...updateData,
      id: parseInt(id), // Ensure ID doesn't change
      updatedAt: new Date()
    };

    return students[studentIndex];
  }

  static async delete(id) {
    const studentIndex = students.findIndex(student => student.id === parseInt(id));
    
    if (studentIndex === -1) {
      throw new Error('Student not found');
    }

    const deletedStudent = students[studentIndex];
    students.splice(studentIndex, 1);
    
    return deletedStudent;
  }

  static async search(query) {
    const { name, major, grade } = query;
    
    return students.filter(student => {
      const nameMatch = !name || student.name.toLowerCase().includes(name.toLowerCase());
      const majorMatch = !major || student.major.toLowerCase().includes(major.toLowerCase());
      const gradeMatch = !grade || student.grade.toLowerCase().includes(grade.toLowerCase());
      
      return nameMatch && majorMatch && gradeMatch;
    });
  }
}

module.exports = Student; 