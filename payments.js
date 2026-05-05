// Payment Processing
class PaymentManager {
    constructor() {
        this.supportedMethods = ['credit-card', 'debit-card', 'paypal', 'google-pay'];
    }

    // Process payment
    processPayment(paymentDetails) {
        // Validate payment details
        if (!this.validatePayment(paymentDetails)) {
            return { success: false, message: 'Invalid payment details' };
        }

        // Simulate payment processing
        const transactionId = this.generateTransactionId();
        const payment = {
            id: transactionId,
            ...paymentDetails,
            status: 'completed',
            processedAt: new Date().toISOString()
        };

        return { success: true, transaction: payment };
    }

    // Validate payment details
    validatePayment(paymentDetails) {
        if (!paymentDetails.method) return false;
        if (!this.supportedMethods.includes(paymentDetails.method)) return false;
        if (paymentDetails.amount <= 0) return false;
        return true;
    }

    // Generate transaction ID
    generateTransactionId() {
        return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    // Get supported payment methods
    getSupportedMethods() {
        return this.supportedMethods;
    }

    // Validate card details
    validateCardDetails(cardNumber, expiry, cvv) {
        // Basic validation (in production, use proper validation)
        const cardRegex = /^\d{16}$/;
        const expiryRegex = /^\d{2}\/\d{2}$/;
        const cvvRegex = /^\d{3,4}$/;

        return cardRegex.test(cardNumber) && expiryRegex.test(expiry) && cvvRegex.test(cvv);
    }

    // Refund payment
    refundPayment(transactionId, amount) {
        return {
            success: true,
            refundId: 'REF' + Date.now(),
            transactionId,
            amount,
            status: 'processed',
            processedAt: new Date().toISOString()
        };
    }
}

// Create global instance
const paymentManager = new PaymentManager();