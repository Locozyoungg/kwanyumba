from fastapi import APIRouter, Depends, Request, Query
from database import get_db
from sqlalchemy.orm import Session
from middleware.analytics_logger import log_user_interaction

router = APIRouter()

@router.get("/search")
async def search_properties(
    request: Request,
    query: str = Query(...),
    db: Session = Depends(get_db)
):
    """
    Search properties and track search analytics.
    """
    # Log the search event
    await log_user_interaction(request, "search", search_query=query)

    # Perform search (dummy response for now)
    return {"results": [], "search_query": query}
