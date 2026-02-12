from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from supabase import Client
from typing import Tuple
import uuid

from app.services.watermark import apply_watermark_to_file


router = APIRouter(
    prefix="/upload",
    tags=["upload"]
)


def get_supabase() -> Client:
    """
    Dependency to get the initialized Supabase client from the main app module.
    """
    from app.main import supabase

    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    return supabase


def _process_image(file: UploadFile) -> Tuple[bytes, bytes, str]:
    """
    Read the uploaded file and apply the watermark.

    Returns (watermarked_bytes, original_bytes, extension)
    """
    try:
        file_bytes = file.file.read()
        watermarked_bytes, original_bytes = apply_watermark_to_file(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process image: {str(e)}")

    # Determine a safe extension
    ext = (file.filename or "").split(".")[-1].lower() if file.filename else "jpg"
    if ext not in ["jpg", "jpeg", "png", "webp"]:
        ext = "jpg"

    return watermarked_bytes, original_bytes, ext


@router.post("/image", status_code=201)
async def upload_image(
    file: UploadFile = File(...),
    supabase: Client = Depends(get_supabase),
):
    """
    Upload an image, apply a watermark, store both original and watermarked
    versions in Supabase Storage, and return storage locations.

    The frontend then turns these storage paths into public URLs using
    the Supabase JS client.
    """
    watermarked_bytes, original_bytes, ext = _process_image(file)

    # Use a single bucket for all images (must exist in Supabase)
    bucket = "photos"
    file_id = str(uuid.uuid4())

    watermarked_path = f"pins/{file_id}_wm.{ext}"
    original_path = f"pins/{file_id}_orig.{ext}"

    try:
        # Upload watermarked version
        supabase.storage.from_(bucket).upload(watermarked_path, watermarked_bytes)

        # Upload original version
        supabase.storage.from_(bucket).upload(original_path, original_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload image to storage: {str(e)}",
        )

    # Return storage info; frontend will convert to public URLs
    return {
        "bucket": bucket,
        "watermarked_path": watermarked_path,
        "original_path": original_path,
    }

