import requests
import os

# NCBA Loop API credentials (replace with actual values)
NCBA_CLIENT_ID = os.getenv("NCBA_CLIENT_ID")
NCBA_CLIENT_SECRET = os.getenv("NCBA_CLIENT_SECRET")
NCBA_AUTH_URL = "https://api.loop.ncbagroup.com/oauth/token"

def get_ncba_access_token():
    """
    Authenticate with NCBA Loop API and return an access token.
    """
    try:
        response = requests.post(
            NCBA_AUTH_URL,
            data={"grant_type": "client_credentials"},
            auth=(NCBA_CLIENT_ID, NCBA_CLIENT_SECRET),
        )
        response.raise_for_status()
        return response.json().get("access_token")
    except requests.exceptions.RequestException as e:
        print(f"NCBA Authentication Error: {e}")
        return None
