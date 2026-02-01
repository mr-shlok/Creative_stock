from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from typing import List, Optional

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Design Marketplace API",
    description="Backend for image & design selling platform",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173",  # Vite default
    "http://localhost:5174",  # Vite backup port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase Setup
url: str = os.environ.get("SUPABASE_PROJECT_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY") # Use Service key for backend operations if needed, or Anon for public. Service key bypasses RLS, so use carefully.

if not url or not key:
    print("Warning: SUPABASE_PROJECT_URL or SUPABASE_SERVICE_KEY not found in environment variables.")

supabase: Client = create_client(url, key)

# Pydantic Models
class PinBase(BaseModel):
    title: str
    image_url: str
    user_id: str

class PinCreate(PinBase):
    pass

class Pin(PinBase):
    id: int
    created_at: Optional[str] = None
    
    class Config:
        from_attributes = True

@app.get("/")
def root():
    return {"message": "FastAPI is running 🚀"}

@app.get("/pins", response_model=List[dict])
def get_pins():
    try:
        response = supabase.table("pins").select("*").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching pins: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pins", response_model=dict)
def create_pin(pin: PinCreate):
    try:
        response = supabase.table("pins").insert(pin.model_dump()).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Could not create pin")
        return response.data[0]
    except Exception as e:
        print(f"Error creating pin: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/pins/{pin_id}")
def delete_pin(pin_id: int):
    try:
        response = supabase.table("pins").delete().eq("id", pin_id).execute()
        return {"message": "Pin deleted"}
    except Exception as e:
        print(f"Error deleting pin: {e}")
        raise HTTPException(status_code=500, detail=str(e))
