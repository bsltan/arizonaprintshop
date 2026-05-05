// Authentication Management
class AuthManager {
    constructor() {
        this.currentUser = this.getStoredUser();
    }

    // Register new user
    register(email, password, name, phone, address) {
        const users = storage.getData('users', []);

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: Math.max(...users.map(u => u.id || 0), 0) + 1,
            email,
            password, // In production, use bcrypt
            name,
            phone,
            address,
            role: 'user',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        storage.setData('users', users);

        return { success: true, user: newUser };
    }

    // Login user
    login(email, password) {
        const users = storage.getData('users', []);
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            this.currentUser = user;
            storage.setData('currentUser', user);
            return { success: true, user };
        }

        return { success: false, message: 'Invalid credentials' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        storage.removeData('currentUser');
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get stored user
    getStoredUser() {
        return storage.getData('currentUser', null);
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Update user profile
    updateProfile(updates) {
        if (!this.currentUser) return { success: false, message: 'Not logged in' };

        const users = storage.getData('users', []);
        const index = users.findIndex(u => u.id === this.currentUser.id);

        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            this.currentUser = users[index];
            storage.setData('users', users);
            storage.setData('currentUser', this.currentUser);
            return { success: true, user: this.currentUser };
        }

        return { success: false, message: 'User not found' };
    }

    // Get all users (admin)
    getAllUsers() {
        return storage.getData('users', []);
    }

    // Delete user (admin)
    deleteUser(userId) {
        const users = storage.getData('users', []);
        const filtered = users.filter(u => u.id !== userId);
        storage.setData('users', filtered);
        return true;
    }
}

// Create global instance
const auth = new AuthManager();