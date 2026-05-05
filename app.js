// Main App Initialization
class App {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUI();
        this.loadPage();
    }

    setupEventListeners() {
        // Auth Button
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.openAuthModal());
        }

        // Admin Button
        const adminBtn = document.getElementById('adminBtn');
        if (adminBtn) {
            adminBtn.addEventListener('click', () => {
                if (auth.isAdmin()) {
                    window.location.href = 'pages/admin.html';
                }
            });
        }

        // Logout Button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.logout();
                window.location.href = '../index.html';
            });
        }

        // Modal close
        const modal = document.getElementById('authModal');
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (modal) {
            window.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }
    }

    updateUI() {
        // Update cart badge
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            cartBadge.textContent = cart.getCartCount();
        }

        // Update auth button
        const authBtn = document.getElementById('authBtn');
        const adminBtn = document.getElementById('adminBtn');
        const ordersLink = document.getElementById('ordersLink');

        if (auth.isLoggedIn()) {
            if (authBtn) authBtn.textContent = `${auth.getCurrentUser().name} (Logout)`;
            if (adminBtn && auth.isAdmin()) adminBtn.style.display = 'block';
            if (ordersLink) ordersLink.style.display = 'block';
        } else {
            if (authBtn) authBtn.textContent = 'Login';
        }
    }

    openAuthModal() {
        const modal = document.getElementById('authModal');
        if (modal) {
            modal.classList.add('active');
            this.renderAuthForm();
        }
    }

    renderAuthForm() {
        const container = document.getElementById('authContainer');
        if (!container) return;

        if (auth.isLoggedIn()) {
            container.innerHTML = `
                <div class="auth-form slideInUp">
                    <h2>Welcome, ${auth.getCurrentUser().name}!</h2>
                    <p>Email: ${auth.getCurrentUser().email}</p>
                    <button class="btn btn-primary btn-block" onclick="app.logout()">Logout</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="auth-tabs">
                    <div class="tab-buttons">
                        <button class="tab-btn active" data-tab="login">Login</button>
                        <button class="tab-btn" data-tab="register">Register</button>
                    </div>

                    <form class="auth-form tab-content active" id="loginForm">
                        <h2>Login</h2>
                        <div class="form-group">
                            <label for="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required placeholder="your@email.com">
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required placeholder="••••••••">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Login</button>
                        <p style="text-align: center; margin-top: 1rem;">Demo: admin@ecomhub.com / admin123</p>
                    </form>

                    <form class="auth-form tab-content" id="registerForm">
                        <h2>Create Account</h2>
                        <div class="form-group">
                            <label for="registerName">Full Name</label>
                            <input type="text" id="registerName" required>
                        </div>
                        <div class="form-group">
                            <label for="registerEmail">Email</label>
                            <input type="email" id="registerEmail" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPassword">Password</label>
                            <input type="password" id="registerPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="registerPhone">Phone</label>
                            <input type="tel" id="registerPhone">
                        </div>
                        <div class="form-group">
                            <label for="registerAddress">Address</label>
                            <input type="text" id="registerAddress">
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">Register</button>
                    </form>
                </div>
            `;

            this.attachAuthFormListeners();
        }
    }

    attachAuthFormListeners() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(btn.dataset.tab + 'Form').classList.add('active');
            });
        });

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                const result = auth.login(email, password);
                if (result.success) {
                    alert('Logged in successfully!');
                    location.reload();
                } else {
                    alert(result.message);
                }
            });
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const phone = document.getElementById('registerPhone').value;
                const address = document.getElementById('registerAddress').value;

                const result = auth.register(email, password, name, phone, address);
                if (result.success) {
                    alert('Account created! Please login.');
                    document.querySelector('[data-tab="login"]').click();
                } else {
                    alert(result.message);
                }
            });
        }
    }

    logout() {
        auth.logout();
        location.reload();
    }

    loadPage() {
        // Load featured products on home page
        const featuredProducts = document.getElementById('featuredProducts');
        if (featuredProducts) {
            const products = productManager.getFeaturedProducts();
            featuredProducts.innerHTML = products.map(product =>
                this.createProductCard(product)
            ).join('');
            this.attachProductCardListeners();
        }
    }

    createProductCard(product) {
        return `
            <div class="product-card slideInUp">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-rating">��� ${product.rating} (${product.reviews} reviews)</p>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="window.location.href='pages/product-detail.html?id=${product.id}'">View</button>
                        <button class="btn btn-secondary" onclick="app.addToCart(${product.id})">Add</button>
                    </div>
                </div>
            </div>
        `;
    }

    attachProductCardListeners() {
        // Product card hover effects
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    addToCart(productId) {
        const result = cart.addItem(productId);
        if (result.success) {
            alert('✅ Item added to cart!');
            this.updateUI();
        } else {
            alert('❌ ' + result.message);
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});