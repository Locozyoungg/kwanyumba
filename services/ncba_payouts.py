import requests
import os
from services.ncba_payments import get_received_payments
from database.models import Booking, Host
from utils.notifications import send_sms

# NCBA Loop API credentials
NCBA_API_BASE_URL = "https://api.loop.ncbagroup.com"
NCBA_ACCOUNT_NUMBER = os.getenv("NCBA_ACCOUNT_NUMBER")

def calculate_commission(amount):
    """
    Calculate the commission based on a fixed deduction model.
    - Deduct KES 500 from KES 2500, then apply the same percentage to higher amounts.
    """
    base_amount = 2500
    base_commission = 500
    commission_rate = base_commission / base_amount  # 500 / 2500 = 0.2 (20%)

    commission = round(amount * commission_rate)
    return commission

def send_payout_to_host(access_token):
    """
    Process payouts to hosts by deducting commission and sending the remaining balance.
    """
    received_payments = get_received_payments(access_token)

    for payment in received_payments:
        amount_received = payment["amount"]
        booking_id = payment.get("reference")  # Ensure paybill reference links to a booking

        booking = Booking.get(booking_id)
        if not booking or booking.status != "pending_payment":
            continue  # Skip if no valid booking is found

        host = Host.get(booking.host_id)

        # Calculate commission and final amount
        commission = calculate_commission(amount_received)
        payout_amount = amount_received - commission

        # Send payment to host
        payout_response = send_ncba_payment(access_token, host.account_number, payout_amount)
        if payout_response.get("status") == "SUCCESS":
            booking.status = "confirmed"
            booking.save()

            # Notify host via SMS
            message = f"Dear {host.name}, KES {payout_amount} has been deposited to your account for booking ID {booking.id}."
            send_sms(host.phone_number, message)

            print(f"Payout of KES {payout_amount} sent to host {host.name}.")

def send_ncba_payment(access_token, recipient_account, amount):
    """
    Send money from NCBA Loop account to host’s account.
    """
    url = f"{NCBA_API_BASE_URL}/transactions"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    payload = {
        "sourceAccount": NCBA_ACCOUNT_NUMBER,
        "destinationAccount": recipient_account,
        "amount": amount,
        "currency": "KES",
        "description": "Host payout for booking",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"Error sending NCBA payout: {e}")
        return {"status": "FAILED"}
