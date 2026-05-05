// Admin Management
class AdminManager {
    constructor() {
        this.checkAdminAccess();
    }

    // Check admin access
    checkAdminAccess() {
        if (!auth.isAdmin()) {
            console.warn('Admin access required');
        }
    }

    // Get dashboard statistics
    getDashboardStats() {
        const orders = storage.getData('orders', []);
        const products = productManager.getAllProducts();
        const users = storage.getData('users', []);
        const reviews = storage.getData('reviews', []);

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalProducts = products.length;
        const totalUsers = users.length;

        const ordersByStatus = {};
        orders.forEach(order => {
            ordersByStatus[order.status] = (ordersByStatus[order.status] || 0) + 1;
        });

        return {
            totalOrders,
            totalRevenue,
            totalProducts,
            totalUsers,
            totalReviews: reviews.length,
            ordersByStatus,
            topProducts: this.getTopProducts(),
            recentOrders: orders.slice(-5)
        };
    }

    // Get top products
    getTopProducts() {
        const products = productManager.getAllProducts();
        return products
            .sort((a, b) => b.reviews - a.reviews)
            .slice(0, 5);
    }

    // Manage orders
    getOrders(filter = {}) {
        let orders = storage.getData('orders', []);

        if (filter.status) {
            orders = orders.filter(o => o.status === filter.status);
        }

        if (filter.userId) {
            orders = orders.filter(o => o.userId === filter.userId);
        }

        return orders;
    }

    // Update order status
    updateOrderStatus(orderId, status) {
        const orders = storage.getData('orders', []);
        const order = orders.find(o => o.id === orderId);

        if (order) {
            order.status = status;
            order.updatedAt = new Date().toISOString();
            storage.setData('orders', orders);
            return { success: true, order };
        }

        return { success: false, message: 'Order not found' };
    }

    // Manage reviews
    getReviews(filter = {}) {
        let reviews = storage.getData('reviews', []);

        if (filter.productId) {
            reviews = reviews.filter(r => r.productId === filter.productId);
        }

        if (filter.status) {
            reviews = reviews.filter(r => r.status === filter.status);
        }

        return reviews;
    }

    // Approve/reject review
    moderateReview(reviewId, status) {
        const reviews = storage.getData('reviews', []);
        const review = reviews.find(r => r.id === reviewId);

        if (review) {
            review.status = status;
            storage.setData('reviews', reviews);
            return { success: true, review };
        }

        return { success: false, message: 'Review not found' };
    }

    // Get system statistics
    getSystemStats() {
        const orders = storage.getData('orders', []);
        const products = productManager.getAllProducts();
        const users = storage.getData('users', []);

        const stats = {
            products: {
                total: products.length,
                lowStock: products.filter(p => p.stock < 10).length
            },
            orders: {
                total: orders.length,
                pending: orders.filter(o => o.status === 'pending').length,
                completed: orders.filter(o => o.status === 'delivered').length
            },
            users: {
                total: users.length,
                admins: users.filter(u => u.role === 'admin').length,
                customers: users.filter(u => u.role === 'user').length
            }
        };

        return stats;
    }
}

// Create global instance
const adminManager = new AdminManager();