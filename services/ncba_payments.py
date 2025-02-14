import requests
import os

# NCBA Loop API credentials (replace with actual values)
NCBA_API_BASE_URL = "https://api.loop.ncbagroup.com"
NCBA_ACCOUNT_NUMBER = os.getenv("NCBA_ACCOUNT_NUMBER")

def get_received_payments(access_token):
    """
    Fetch the list of recent payments received in the NCBA Loop account.
    """
    url = f"{NCBA_API_BASE_URL}/accounts/{NCBA_ACCOUNT_NUMBER}/transactions"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        transactions = response.json().get("transactions", [])

        # Filter only credit transactions (incoming payments)
        received_payments = [tx for tx in transactions if tx.get("type") == "CREDIT"]
        return received_payments

    except requests.exceptions.RequestException as e:
        print(f"Error fetching NCBA payments: {e}")
        return []
