const bcrypt = require('bcryptjs');

// In-memory storage for users (in production, use a database)
let users = [
  {
    id: 1,
    email: 'admin@example.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date()
  }
];

class User {
  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  static async create(userData) {
    const { email, password, name, role = 'user' } = userData;
    
    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date()
    };

    users.push(newUser);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  static async getAll() {
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = User; 