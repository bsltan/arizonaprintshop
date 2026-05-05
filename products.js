// Product Management
class ProductManager {
    constructor() {
        this.products = storage.getData('products', []);
    }

    // Get all products
    getAllProducts() {
        return storage.getData('products', []);
    }

    // Get product by ID
    getProductById(id) {
        const products = this.getAllProducts();
        return products.find(p => p.id === parseInt(id));
    }

    // Get products by category
    getByCategory(category) {
        const products = this.getAllProducts();
        return products.filter(p => p.category === category);
    }

    // Search products
    searchProducts(query) {
        const products = this.getAllProducts();
        const lowerQuery = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery)
        );
    }

    // Filter products
    filterProducts(filters) {
        let products = this.getAllProducts();

        if (filters.category) {
            products = products.filter(p => p.category === filters.category);
        }

        if (filters.maxPrice) {
            products = products.filter(p => p.price <= filters.maxPrice);
        }

        if (filters.minPrice) {
            products = products.filter(p => p.price >= filters.minPrice);
        }

        if (filters.minRating) {
            products = products.filter(p => p.rating >= filters.minRating);
        }

        return products;
    }

    // Sort products
    sortProducts(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return sorted.reverse();
            default:
                return sorted;
        }
    }

    // Add product (admin)
    addProduct(product) {
        const products = this.getAllProducts();
        const newId = Math.max(...products.map(p => p.id), 0) + 1;
        const newProduct = {
            ...product,
            id: newId,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        storage.setData('products', products);
        return newProduct;
    }

    // Update product (admin)
    updateProduct(id, updates) {
        const products = this.getAllProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            storage.setData('products', products);
            return products[index];
        }
        return null;
    }

    // Delete product (admin)
    deleteProduct(id) {
        const products = this.getAllProducts();
        const filtered = products.filter(p => p.id !== id);
        storage.setData('products', filtered);
        return true;
    }

    // Get featured products
    getFeaturedProducts(limit = 4) {
        const products = this.getAllProducts();
        return products.slice(0, limit);
    }

    // Get categories
    getCategories() {
        const products = this.getAllProducts();
        const categories = new Set(products.map(p => p.category));
        return Array.from(categories);
    }

    // Add review to product
    addReview(productId, review) {
        const reviews = storage.getData('reviews', []);
        const newReview = {
            id: Math.max(...reviews.map(r => r.id || 0), 0) + 1,
            productId,
            ...review,
            createdAt: new Date().toISOString()
        };
        reviews.push(newReview);
        storage.setData('reviews', reviews);

        // Update product rating
        this.updateProductRating(productId);
        return newReview;
    }

    // Get product reviews
    getProductReviews(productId) {
        const reviews = storage.getData('reviews', []);
        return reviews.filter(r => r.productId === parseInt(productId));
    }

    // Update product rating
    updateProductRating(productId) {
        const reviews = this.getProductReviews(productId);
        if (reviews.length === 0) return;

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        this.updateProduct(productId, {
            rating: Math.round(avgRating * 10) / 10,
            reviews: reviews.length
        });
    }
}

// Create global instance
const productManager = new ProductManager();