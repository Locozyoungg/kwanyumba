# File Location: backend/app/main.py
# Description: Entry point for the Kwanyumba FastAPI backend.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings  # Import project settings
from app.api import auth, bookings, payments, properties, users  # Import API routers
from app.core.database import engine, Base  # Import database configurations

# Automatically create database tables if they don’t already exist
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app with metadata
app = FastAPI(
    title="Kwanyumba API",
    version="1.0.0",
    description="API for Kwanyumba Rental Platform",
)

# CORS Middleware - Allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to the frontend's domain in production for security
    allow_credentials=True,
    allow_methods=["*"],  # Allow all request methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)

# Register API routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])  # User authentication routes
app.include_router(users.router, prefix="/api/users", tags=["Users"])  # User management routes
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])  # Property listings
app.include_router(bookings.router, prefix="/api/bookings", tags=["Bookings"])  # Booking management
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])  # Payment processing

# Root endpoint - Simple welcome message for API status check
@app.get("/")
def root():
    return {"message": "Welcome to the Kwanyumba API 🚀"}

