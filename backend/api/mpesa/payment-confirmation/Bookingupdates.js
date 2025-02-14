const db = require("../config/database");

// Function to update booking status upon successful payment
async function updateBookingStatus(accountNumber, transactionId, amountPaid, phoneNumber) {
    try {
        const query = "UPDATE bookings SET status = 'confirmed', transaction_id = $1 WHERE house_id = $2 AND status = 'pending'";
        const result = await db.query(query, [transactionId, accountNumber]);

        return result.rowCount > 0; // Return true if a booking was updated
    } catch (error) {
        console.error("Error updating booking:", error);
        return false;
    }
}

// Function to send SMS/WhatsApp notification
async function sendNotification(phoneNumber, message) {
    // Here, integrate Twilio or Africa’s Talking API to send SMS/WhatsApp messages
    console.log(`Notification sent to ${phoneNumber}: ${message}`);
}

// Function to update booking status and notify the host
async function updateBookingStatus(accountNumber, transactionId, amountPaid, phoneNumber) {
    try {
        // Fetch booking and host details
        const fetchQuery = `
            SELECT b.*, h.phone AS host_phone
            FROM bookings b
            JOIN houses h ON b.house_id = h.id
            WHERE b.house_id = $1 AND b.status = 'pending'
        `;
        const { rows } = await db.query(fetchQuery, [accountNumber]);

        if (rows.length === 0) return false; // No pending booking found

        const booking = rows[0];
        const hostPhone = booking.host_phone;

        // Update the booking status
        const updateQuery = "UPDATE bookings SET status = 'confirmed', transaction_id = $1 WHERE house_id = $2";
        await db.query(updateQuery, [transactionId, accountNumber]);

        // Notify the guest
        await sendNotification(phoneNumber, `Your payment of Ksh ${amountPaid} was successful. Your house is now booked!`);

        // Notify the host
        await sendNotification(hostPhone, `Your house (ID: ${booking.house_id}) has been booked by a guest. Check-in: ${booking.check_in_date}`);

        return true;

    } catch (error) {
        console.error("Error updating booking:", error);
        return false;
    }
}

module.exports = { updateBookingStatus, sendNotification };
