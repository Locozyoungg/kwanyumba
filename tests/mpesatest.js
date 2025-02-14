const { updateBookingStatus } = require("../services/paymentService");

// Simulated M-Pesa payment data
const testPayment = {
    accountNumber: "HOUSE123", // House ID (used as account number)
    transactionId: "TXN987654321",
    amountPaid: 5000,
    phoneNumber: "+254712345678" // Guest's phone number
};

// Run the test
(async () => {
    const result = await updateBookingStatus(
        testPayment.accountNumber,
        testPayment.transactionId,
        testPayment.amountPaid,
        testPayment.phoneNumber
    );

    console.log(result ? "✅ Payment processed & booking confirmed!" : "❌ Payment processing failed.");
})();
