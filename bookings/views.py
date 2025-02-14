# bookings/views.py
from payments.service import process_host_payout

def confirm_booking(booking_id):
    """
    Confirms booking, deducts commission, and pays host.
    """
    booking = get_booking_by_id(booking_id)  # Fetch booking details

    if booking and booking.status == "paid":
        payout_log = process_host_payout(booking)
        
        # Update booking status
        booking.status = "confirmed"
        save_booking(booking)

        return {"message": "Booking confirmed and payout sent", "payout_log": payout_log}

    return {"error": "Invalid booking or payment not received"}
