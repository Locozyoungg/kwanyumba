# payments/utils.py

def calculate_commission(amount):
    """
    Calculates the commission at 20% based on KES 500 from KES 2500.
    """
    commission_percentage = 500 / 2500  # 20%
    commission = amount * commission_percentage
    return round(commission, 2)  # Round to 2 decimal places
