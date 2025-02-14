from sqlalchemy import Column, String, ForeignKey, TIMESTAMP, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base  # Import database connection

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.uuid_generate_v4())  
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # User ID (if logged in)
    action_type = Column(String(50), nullable=False)  # Interaction type (view, search, booking_attempt)
    property_id = Column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=True)  # Property ID (if applicable)
    search_query = Column(Text, nullable=True)  # Search terms for tracking user interests
    user_location = Column(Text, nullable=True)  # Approximate location (city, region)
    device_type = Column(String(50), nullable=True)  # Device category (mobile, desktop, tablet)
    created_at = Column(TIMESTAMP, server_default=func.now())  # Timestamp of event

  # Define indexes for fast query performance
    __table_args__ = (
        Index("idx_property_action", "property_id", "action_type"),
        Index("idx_location_search", "user_location", "search_query"),
    )