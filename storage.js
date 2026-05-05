// Local Storage Management
class StorageManager {
    constructor() {
        this.dbName = 'ecomhubDB';
    }

    // Initialize default data
    initializeData() {
        if (!this.getData('products')) {
            this.setData('products', this.getDefaultProducts());
        }
        if (!this.getData('users')) {
            this.setData('users', this.getDefaultUsers());
        }
        if (!this.getData('cart')) {
            this.setData('cart', []);
        }
        if (!this.getData('orders')) {
            this.setData('orders', []);
        }
        if (!this.getData('reviews')) {
            this.setData('reviews', []);
        }
    }

    // Set data in localStorage
    setData(key, value) {
        try {
            localStorage.setItem(`${this.dbName}_${key}`, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    }

    // Get data from localStorage
    getData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`${this.dbName}_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error retrieving data:', error);
            return defaultValue;
        }
    }

    // Remove data from localStorage
    removeData(key) {
        try {
            localStorage.removeItem(`${this.dbName}_${key}`);
            return true;
        } catch (error) {
            console.error('Error removing data:', error);
            return false;
        }
    }

    // Clear all data
    clearAll() {
        try {
            for (let key in localStorage) {
                if (key.startsWith(this.dbName)) {
                    localStorage.removeItem(key);
                }
            }
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    // Get default products
    getDefaultProducts() {
        return [
            {
                id: 1,
                name: 'Wireless Headphones',
                price: 79.99,
                category: 'Electronics',
                image: '🎧',
                rating: 4.5,
                reviews: 120,
                description: 'Premium wireless headphones with noise cancellation',
                stock: 50,
                specs: {
                    battery: '30 hours',
                    connectivity: 'Bluetooth 5.0',
                    weight: '250g'
                }
            },
            {
                id: 2,
                name: 'Smart Watch',
                price: 199.99,
                category: 'Electronics',
                image: '⌚',
                rating: 4.3,
                reviews: 95,
                description: 'Feature-rich smartwatch with health monitoring',
                stock: 35,
                specs: {
                    display: '1.4" AMOLED',
                    battery: '14 days',
                    waterproof: '5ATM'
                }
            },
            {
                id: 3,
                name: 'Running Shoes',
                price: 89.99,
                category: 'Footwear',
                image: '👟',
                rating: 4.6,
                reviews: 200,
                description: 'Comfortable running shoes for athletes',
                stock: 100,
                specs: {
                    material: 'Mesh',
                    sole: 'Rubber',
                    sizes: '6-14'
                }
            },
            {
                id: 4,
                name: 'Winter Jacket',
                price: 129.99,
                category: 'Fashion',
                image: '🧥',
                rating: 4.4,
                reviews: 85,
                description: 'Warm and stylish winter jacket',
                stock: 40,
                specs: {
                    material: 'Polyester',
                    insulation: 'Down-filled',
                    colors: 'Black, Blue, Red'
                }
            },
            {
                id: 5,
                name: 'Coffee Maker',
                price: 59.99,
                category: 'Home',
                image: '☕',
                rating: 4.2,
                reviews: 110,
                description: 'Automatic drip coffee maker',
                stock: 60,
                specs: {
                    capacity: '12 cups',
                    power: '1000W',
                    features: 'Programmable timer'
                }
            },
            {
                id: 6,
                name: 'Yoga Mat',
                price: 29.99,
                category: 'Home',
                image: '🧘',
                rating: 4.7,
                reviews: 150,
                description: 'Non-slip yoga mat for workouts',
                stock: 80,
                specs: {
                    material: 'TPE',
                    thickness: '6mm',
                    length: '173cm'
                }
            },
            {
                id: 7,
                name: 'Desk Lamp',
                price: 39.99,
                category: 'Home',
                image: '💡',
                rating: 4.5,
                reviews: 75,
                description: 'LED desk lamp with adjustable brightness',
                stock: 45,
                specs: {
                    brightness: 'Dimmable',
                    color: 'Warm/Cool',
                    power: 'USB-C'
                }
            },
            {
                id: 8,
                name: 'Gaming Mouse',
                price: 59.99,
                category: 'Electronics',
                image: '🖱️',
                rating: 4.8,
                reviews: 180,
                description: 'High-precision gaming mouse',
                stock: 70,
                specs: {
                    dpi: '16000',
                    buttons: '8',
                    weight: '95g'
                }
            }
        ];
    }

    // Get default users
    getDefaultUsers() {
        return [
            {
                id: 1,
                email: 'admin@ecomhub.com',
                password: 'admin123',
                name: 'Admin User',
                role: 'admin',
                phone: '+1-800-ADMIN',
                address: '123 Admin Street, Admin City',
                createdAt: new Date().toISOString()
            },
            {
                id: 2,
                email: 'user@ecomhub.com',
                password: 'user123',
                name: 'John Doe',
                role: 'user',
                phone: '+1-800-USER',
                address: '456 User Avenue, User Town',
                createdAt: new Date().toISOString()
            }
        ];
    }
}

// Create global instance
const storage = new StorageManager();
storage.initializeData();