# dashboard/views.py
from payments.models import Transaction

def get_admin_earnings():
    """
    Fetches total commission earnings & total payouts for admin dashboard.
    """
    transactions = Transaction.objects.all()
    total_earnings = sum(tx.commission for tx in transactions)
    total_payouts = sum(tx.payout_amount for tx in transactions)

    return {
        "total_earnings": total_earnings,
        "total_payouts": total_payouts,
        "transactions": transactions
    }
