# File Location: backend/app/core/database.py
# Description: Database connection setup for Kwanyumba.

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create SQLAlchemy engine (connects to database)
engine = create_engine(settings.DATABASE_URL)

# Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy models
Base = declarative_base()

# Dependency to get a database session in API routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
