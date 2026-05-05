// Shopping Cart Management
class CartManager {
    constructor() {
        this.cart = storage.getData('cart', []);
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        const product = productManager.getProductById(productId);
        if (!product) return { success: false, message: 'Product not found' };

        const existingItem = this.cart.find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        return { success: true, message: 'Item added to cart' };
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
        return { success: true, message: 'Item removed from cart' };
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.productId === productId);
        if (item) {
            if (quantity <= 0) {
                return this.removeItem(productId);
            }
            item.quantity = quantity;
            this.saveCart();
            return { success: true };
        }
        return { success: false, message: 'Item not found in cart' };
    }

    // Get cart items with product details
    getCartItems() {
        return this.cart.map(item => {
            const product = productManager.getProductById(item.productId);
            return {
                ...item,
                product,
                subtotal: product ? product.price * item.quantity : 0
            };
        });
    }

    // Get cart total
    getCartTotal() {
        const items = this.getCartItems();
        return items.reduce((total, item) => total + item.subtotal, 0);
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
        return { success: true, message: 'Cart cleared' };
    }

    // Save cart to storage
    saveCart() {
        storage.setData('cart', this.cart);
    }

    // Check if product in cart
    hasProduct(productId) {
        return this.cart.some(item => item.productId === productId);
    }

    // Get cart with calculations
    getCartSummary() {
        const subtotal = this.getCartTotal();
        const tax = subtotal * 0.1;
        const shipping = 10;
        const total = subtotal + tax + shipping;

        return {
            subtotal,
            tax,
            shipping,
            total,
            count: this.getCartCount(),
            items: this.getCartItems()
        };
    }
}

// Create global instance
const cart = new CartManager();