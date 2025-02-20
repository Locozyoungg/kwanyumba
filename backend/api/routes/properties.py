from fastapi import APIRouter, Depends, Request
from database import get_db
from sqlalchemy.orm import Session
from middleware.analytics_logger import log_user_interaction
from models.properties import Property

router = APIRouter()

@router.get("/properties/{property_id}")
async def get_property(property_id: str, request: Request, db: Session = Depends(get_db)):
    """
    Fetches property details and logs the view interaction.
    """
    # Fetch property details
    property_details = db.query(Property).filter(Property.id == property_id).first()

    if not property_details:
        return {"error": "Property not found"}

    # Log analytics event for property view
    await log_user_interaction(request, "view", property_id=property_id)

    return property_details
