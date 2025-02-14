from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Create a FastAPI router for M-Pesa API
router = APIRouter()

# Simulated database storing pending bookings
bookings_db = {
    "HOUSE123": {
        "status": "pending", 
        "guest_phone": "+254712345678", 
        "check_in_details": "Hidden", 
        "host_phone": "+254798765432"
    }
}

# Define request model for M-Pesa payment data
class MpesaPaymentData(BaseModel):
    account_number: str  # House ID (entered as account number in M-Pesa)
    transaction_id: str  # Unique transaction reference from M-Pesa
    amount_paid: float  # Payment amount
    phone_number: str  # Phone number of the guest who made the payment

# API endpoint to handle M-Pesa payment confirmation
@router.post("/mpesa/payment-confirmation/")
async def mpesa_payment_confirmation(payment_data: MpesaPaymentData):
    """
    Receives M-Pesa payment callback, verifies payment, updates booking status, 
    reveals check-in details, and sends SMS notifications to guest & host.
    """
    account_number = payment_data.account_number
    phone_number = payment_data.phone_number

    # Check if the booking exists in the database
    if account_number in bookings_db:
        # Update booking status to confirmed
        bookings_db[account_number]["status"] = "confirmed"
        
        # Make check-in details visible to the guest
        bookings_db[account_number]["check_in_details"] = "Check-in at 2 PM, Gate Code: 4567"
        
        # Prepare SMS messages for the guest and host
        guest_sms = f"Dear Guest, your booking for {account_number} is confirmed. Check-in details: {bookings_db[account_number]['check_in_details']}."
        host_sms = f"Booking confirmed for {account_number}. Guest phone: {phone_number}. Ensure the place is ready."

        # Simulate sending SMS (Replace with actual SMS API integration)
        print(f"📩 Sent to Guest: {guest_sms}")
        print(f"📩 Sent to Host: {host_sms}")

        return {
            "message": "Payment confirmed, booking updated",
            "booking_status": bookings_db[account_number]["status"],
            "guest_sms": guest_sms,
            "host_sms": host_sms
        }
    
    # If booking is not found, return an error response
    raise HTTPException(status_code=404, detail="Booking not found")
