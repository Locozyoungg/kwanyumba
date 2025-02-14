# payments/service.py
from payments.utils import calculate_commission
from mpesa_api import send_mpesa_payment  # Function to process M-Pesa disbursement

def process_host_payout(booking):
    """
    Deducts 20% commission and sends the remaining payout to the host.
    """
    total_amount = booking.amount
    commission = calculate_commission(total_amount)
    payout_amount = total_amount - commission  # Host payout

    # Trigger M-Pesa Payout
    response = send_mpesa_payment(
        phone_number=booking.host.phone_number,
        amount=payout_amount,
        reason="Booking Payout"
    )

    # Log transaction
    transaction_log = {
        "booking_id": booking.id,
        "total_amount": total_amount,
        "commission": commission,
        "payout_amount": payout_amount,
        "mpesa_response": response
    }
    return transaction_log
