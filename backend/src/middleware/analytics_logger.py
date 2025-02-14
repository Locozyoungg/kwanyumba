from fastapi import Request
from sqlalchemy.orm import Session
from models.analytics import Analytics
from utils.device_detector import get_device_type  # Helper to detect device type
from database import get_db

async def log_user_interaction(
    request: Request,
    action_type: str,
    property_id=None,
    search_query=None,
    user_id=None
):
    """
    Logs user interactions such as property views, searches, and booking attempts.
    """
    db: Session = next(get_db())

    # Detect user device type (mobile, desktop, tablet)
    user_agent = request.headers.get("User-Agent", "")
    device_type = get_device_type(user_agent)

    # Get user location (e.g., using IP address, can be enhanced later)
    user_location = request.client.host  # Placeholder, can use a geo-location API

    # Save event to the database
    analytics_event = Analytics(
        user_id=user_id,
        action_type=action_type,
        property_id=property_id,
        search_query=search_query,
        user_location=user_location,
        device_type=device_type,
    )
    db.add(analytics_event)
    db.commit()
    db.refresh(analytics_event)
