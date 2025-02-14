from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from database import get_db
from models.users import User
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Extracts the current logged-in user and ensures they are the admin (platform owner).
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

        user = db.query(User).filter(User.id == user_id).first()
        if not user or not user.is_admin:  # Only allow platform owner
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

        return user

    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
