// Mock user data - replace with actual API calls later
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // In production, use hashed passwords
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString(),
    lastLogin: null
  }
];

class AuthService {
  constructor() {
    this.currentUser = null;
    this.token = localStorage.getItem('token');
  }

  async login(username, password) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // In production, use JWT or similar
    const token = btoa(`${username}:${Date.now()}`);
    this.token = token;
    this.currentUser = { ...user, password: undefined };
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(this.currentUser));

    // Update last login
    user.lastLogin = new Date().toISOString();

    return this.currentUser;
  }

  async logout() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    this.token = null;
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.currentUser = JSON.parse(userStr);
      return this.currentUser;
    }

    return null;
  }

  isAuthenticated() {
    return !!this.token;
  }

  hasRole(role) {
    return this.currentUser?.role === role;
  }

  isAdmin() {
    return this.hasRole('admin');
  }
}

export const authService = new AuthService(); 