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
# Use Service key for backend operations if available, fallback to Anon key
service_key: str = os.environ.get("SUPABASE_SERVICE_KEY")
anon_key: str = os.environ.get("SUPABASE_ANON_KEY")

if not url:
    print("CRITICAL: SUPABASE_PROJECT_URL not found!")

# Use service key if available, otherwise anon key
key = service_key if service_key else anon_key

if not key:
    print("CRITICAL: Neither SUPABASE_SERVICE_KEY nor SUPABASE_ANON_KEY found!")

try:
    supabase: Client = create_client(url, key)
    print(f"Supabase client initialized using {'service_role' if service_key else 'anon'} key.")
except Exception as e:
    print(f"Failed to initialize Supabase client: {e}")
    supabase = None

# Pydantic Models
class BoardBase(BaseModel):
    name: str
    user_id: str

class BoardCreate(BoardBase):
    pass

class Board(BoardBase):
    id: str
    created_at: Optional[str] = None

# Helper for Pydantic v1/v2 compatibility
def get_model_dict(model: BaseModel):
    return model.model_dump() if hasattr(model, 'model_dump') else model.dict()

@app.get("/")
def root():
    return {"message": "FastAPI is running 🚀"}

@app.get("/boards", response_model=List[dict])
def get_boards(user_id: Optional[str] = None):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    try:
        query = supabase.table("boards").select("*")
        if user_id:
            query = query.eq("user_id", user_id)
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Error fetching boards: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/boards", response_model=dict)
def create_board(board: BoardCreate):
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    try:
        data = get_model_dict(board)
        response = supabase.table("boards").insert(data).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Could not create board")
        return response.data[0]
    except Exception as e:
        print(f"Error creating board: {e}")
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}. Check if user_id is correct and UUID is valid.")
