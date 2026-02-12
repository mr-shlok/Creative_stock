from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from supabase import Client
from typing import Optional
import os

router = APIRouter(
    prefix="/auth",
    tags=["authentication"]
)

# Pydantic Models
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: dict

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordUpdateRequest(BaseModel):
    password: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Dependency to get Supabase client
def get_supabase() -> Client:
    from app.main import supabase
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    return supabase

@router.post("/signup", response_model=dict)
async def signup(request: SignupRequest, supabase: Client = Depends(get_supabase)):
    """
    Register a new user with email and password
    """
    try:
        # Sign up with Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password,
            "options": {
                "data": {
                    "username": request.username
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Could not create user")
        
        return {
            "message": "User created successfully. Please check your email for verification.",
            "user_id": auth_response.user.id
        }
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, supabase: Client = Depends(get_supabase)):
    """
    Login with email and password
    """
    try:
        # Sign in with Supabase Auth
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not auth_response.user or not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Get user profile to check role
        profile_response = supabase.table("profiles").select("*").eq("id", auth_response.user.id).execute()
        
        user_data = {
            "id": auth_response.user.id,
            "email": auth_response.user.email,
            "role": profile_response.data[0].get("role", "user") if profile_response.data else "user"
        }
        
        return LoginResponse(
            access_token=auth_response.session.access_token,
            refresh_token=auth_response.session.refresh_token,
            user=user_data
        )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/logout")
async def logout(authorization: Optional[str] = Header(None), supabase: Client = Depends(get_supabase)):
    """
    Logout current user
    """
    try:
        if authorization and authorization.startswith("Bearer "):
            token = authorization.split("Bearer ")[1]
            # Set the session for the logout
            supabase.auth.sign_out()
        
        return {"message": "Logged out successfully"}
    except Exception as e:
        print(f"Logout error: {e}")
        # Even if there's an error, we can return success since the client will clear the token
        return {"message": "Logged out successfully"}

@router.post("/refresh")
async def refresh_token(request: RefreshTokenRequest, supabase: Client = Depends(get_supabase)):
    """
    Refresh access token using refresh token
    """
    try:
        auth_response = supabase.auth.refresh_session(request.refresh_token)
        
        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token
        }
    except Exception as e:
        print(f"Token refresh error: {e}")
        raise HTTPException(status_code=401, detail="Could not refresh token")

@router.post("/password-reset")
async def request_password_reset(request: PasswordResetRequest, supabase: Client = Depends(get_supabase)):
    """
    Request password reset email
    """
    try:
        supabase.auth.reset_password_for_email(request.email)
        
        return {"message": "If the email exists, a password reset link has been sent"}
    except Exception as e:
        print(f"Password reset request error: {e}")
        # Return success even on error for security (don't expose if email exists)
        return {"message": "If the email exists, a password reset link has been sent"}

@router.post("/password-update")
async def update_password(
    request: PasswordUpdateRequest, 
    authorization: str = Header(...),
    supabase: Client = Depends(get_supabase)
):
    """
    Update user password (requires authentication)
    """
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = authorization.split("Bearer ")[1]
        
        # Update password
        auth_response = supabase.auth.update_user({
            "password": request.password
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Could not update password")
        
        return {"message": "Password updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Password update error: {e}")
        raise HTTPException(status_code=400, detail="Could not update password")

@router.get("/me")
async def get_current_user(
    authorization: str = Header(...),
    supabase: Client = Depends(get_supabase)
):
    """
    Get current authenticated user information
    """
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        token = authorization.split("Bearer ")[1]
        
        # Get user from token
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        # Get user profile
        profile_response = supabase.table("profiles").select("*").eq("id", user_response.user.id).execute()
        
        user_data = {
            "id": user_response.user.id,
            "email": user_response.user.email,
            "role": profile_response.data[0].get("role", "user") if profile_response.data else "user",
            "username": profile_response.data[0].get("username") if profile_response.data else None,
            "avatar_url": profile_response.data[0].get("avatar_url") if profile_response.data else None
        }
        
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        print(f"Get user error: {e}")
        raise HTTPException(status_code=401, detail="Could not get user information")
