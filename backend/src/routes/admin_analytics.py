from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.analytics import Analytics
from models.properties import Property
from auth.dependencies import get_current_admin  # Ensures only the admin can access
from sqlalchemy.sql import func

router = APIRouter()

@router.get("/admin/analytics", tags=["Admin"])
async def get_analytics(db: Session = Depends(get_db), admin: dict = Depends(get_current_admin)):
    """
    Fetch key analytics insights - only accessible to the platform owner.
    """

    # Total property views count
    total_views = db.query(func.count(Analytics.id)).filter(Analytics.action_type == "view").scalar()

    # Top 5 most viewed properties
    top_properties = (
        db.query(Property.id, Property.title, func.count(Analytics.id).label("views"))
        .join(Analytics, Property.id == Analytics.property_id)
        .filter(Analytics.action_type == "view")
        .group_by(Property.id)
        .order_by(func.count(Analytics.id).desc())
        .limit(5)
        .all()
    )

    # Top searched keywords
    top_searches = (
        db.query(Analytics.search_query, func.count(Analytics.id).label("search_count"))
        .filter(Analytics.search_query.isnot(None))
        .group_by(Analytics.search_query)
        .order_by(func.count(Analytics.id).desc())
        .limit(5)
        .all()
    )

    # High-traffic locations
    top_locations = (
        db.query(Analytics.user_location, func.count(Analytics.id).label("location_count"))
        .filter(Analytics.user_location.isnot(None))
        .group_by(Analytics.user_location)
        .order_by(func.count(Analytics.id).desc())
        .limit(5)
        .all()
    )

    return {
        "total_views": total_views,
        "top_properties": [{"id": p[0], "title": p[1], "views": p[2]} for p in top_properties],
        "top_searches": [{"query": s[0], "count": s[1]} for s in top_searches],
        "top_locations": [{"location": l[0], "count": l[1]} for l in top_locations],
    }
