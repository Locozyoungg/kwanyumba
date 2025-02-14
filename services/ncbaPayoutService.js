const axios = require('axios');
require('dotenv').config();

const NCBA_API_BASE_URL = process.env.NCBA_BASE_URL;
const ACCOUNT_NUMBER = process.env.NCBA_ACCOUNT_NUMBER;
const API_KEY = process.env.NCBA_API_KEY;
const API_SECRET = process.env.NCBA_API_SECRET;

/**
 * Function to authenticate with NCBA API
 */
async function getAuthToken() {
    try {
        const response = await axios.post(`${NCBA_API_BASE_URL}/auth/token`, {
            apiKey: API_KEY,
            apiSecret: API_SECRET
        });

        return response.data.token;
    } catch (error) {
        console.error("NCBA Authentication Failed:", error.response?.data || error.message);
        throw new Error("Failed to authenticate with NCBA API.");
    }
}

/**
 * Function to send payout from NCBA to M-Pesa
 */
async function sendPayoutToHost(hostPhoneNumber, amount, bookingId) {
    try {
        const token = await getAuthToken();

        const response = await axios.post(`${NCBA_API_BASE_URL}/payments/mpesa`, {
            sourceAccount: ACCOUNT_NUMBER,
            destinationNumber: hostPhoneNumber,
            amount: amount,
            reference: `Booking_${bookingId}`
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Payout Successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Payout Error:", error.response?.data || error.message);
        throw new Error("Failed to process payout.");
    }
}

module.exports = { sendPayoutToHost };
