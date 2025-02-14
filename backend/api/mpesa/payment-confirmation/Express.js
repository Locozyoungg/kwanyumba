const express = require("express");
const bodyParser = require("body-parser");
const { updateBookingStatus, sendNotification } = require("../services/bookingService");

const router = express.Router();
router.use(bodyParser.json());

// Webhook to handle M-Pesa payment confirmation
router.post("/payment-confirmation", async (req, res) => {
    try {
        const { Body } = req.body; // Extracting the payment details
        if (!Body || !Body.stkCallback) {
            return res.status(400).json({ message: "Invalid M-Pesa response" });
        }

        const callbackData = Body.stkCallback;
        const resultCode = callbackData.ResultCode; // 0 means success
        const transactionDetails = callbackData.CallbackMetadata?.Item;

        if (resultCode !== 0) {
            console.log("Payment failed or canceled.");
            return res.status(200).json({ message: "Payment failed or canceled" });
        }

        // Extract transaction details
        const transactionId = transactionDetails.find(item => item.Name === "MpesaReceiptNumber")?.Value;
        const amountPaid = transactionDetails.find(item => item.Name === "Amount")?.Value;
        const accountNumber = transactionDetails.find(item => item.Name === "AccountReference")?.Value;
        const phoneNumber = transactionDetails.find(item => item.Name === "PhoneNumber")?.Value;

        if (!transactionId || !amountPaid || !accountNumber) {
            return res.status(400).json({ message: "Incomplete payment details" });
        }

        // Update booking status based on account number (which is linked to house ID)
        const bookingUpdated = await updateBookingStatus(accountNumber, transactionId, amountPaid, phoneNumber);
        
        if (bookingUpdated) {
            // Notify user of successful booking
            await sendNotification(phoneNumber, `Your payment of Ksh ${amountPaid} was successful. Your house is now booked!`);
            return res.status(200).json({ message: "Booking confirmed successfully" });
        } else {
            return res.status(400).json({ message: "Booking not found or already confirmed" });
        }

    } catch (error) {
        console.error("Error processing M-Pesa payment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// API to get check-in details (Only for confirmed bookings)
router.get("/check-in/:bookingId", async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Fetch booking details from the database
        const query = "SELECT * FROM bookings WHERE id = $1 AND status = 'confirmed'";
        const { rows } = await db.query(query, [bookingId]);

        if (rows.length === 0) {
            return res.status(403).json({ message: "Booking not confirmed. Check-in details unavailable." });
        }

        const booking = rows[0];

        // Return check-in details
        return res.status(200).json({
            houseId: booking.house_id,
            checkInDate: booking.check_in_date,
            checkOutDate: booking.check_out_date,
            location: booking.location,
            doorCode: booking.door_code // Only available for confirmed bookings
        });

    } catch (error) {
        console.error("Error fetching check-in details:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
