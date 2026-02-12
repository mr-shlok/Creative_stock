from fastapi import APIRouter, Depends, Header, HTTPException
from supabase import Client
from typing import Optional


router = APIRouter(
    prefix="/pins",
    tags=["pins"],
)


def get_supabase() -> Client:
    """
    Dependency to get the initialized Supabase client from the main app module.
    """
    from app.main import supabase

    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase client not initialized")
    return supabase


def get_current_user_id(
    authorization: Optional[str] = Header(None),
    supabase: Client = Depends(get_supabase),
) -> str:
    """
    Resolve the current user ID from the Supabase access token in the
    Authorization header.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")

    token = authorization.split("Bearer ")[1]

    try:
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        return user_response.user.id
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=401, detail="Could not verify user from token")


@router.post("/like/{pin_id}")
async def toggle_like(
    pin_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase),
):
    """
    Toggle like for a pin for the current user.

    Uses a `likes` table with columns:
      - id (uuid)
      - user_id (uuid)
      - pin_id (uuid)
      - created_at (timestamp)
    """
    try:
        # Check if like already exists
        existing = (
            supabase.table("likes")
            .select("*")
            .eq("user_id", user_id)
            .eq("pin_id", pin_id)
            .execute()
        )

        if existing.data:
            # Unlike (delete row)
            supabase.table("likes") \
                .delete() \
                .eq("user_id", user_id) \
                .eq("pin_id", pin_id) \
                .execute()
            liked = False
        else:
            # Like (insert row)
            supabase.table("likes") \
                .insert({"user_id": user_id, "pin_id": pin_id}) \
                .execute()
            liked = True

        # Get updated like count
        count_resp = (
            supabase.table("likes")
            .select("id", count="exact")
            .eq("pin_id", pin_id)
            .execute()
        )
        likes_count = count_resp.count or 0

        return {"liked": liked, "likes_count": likes_count}
    except Exception as e:
        print(f"Error toggling like for pin {pin_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to toggle like")


@router.get("/likes/{pin_id}")
async def get_likes(
    pin_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase),
):
    """
    Get like status and total likes for a pin for the current user.
    """
    try:
        # Check if user liked
        existing = (
            supabase.table("likes")
            .select("id")
            .eq("user_id", user_id)
            .eq("pin_id", pin_id)
            .execute()
        )
        liked = bool(existing.data)

        # Total likes
        count_resp = (
            supabase.table("likes")
            .select("id", count="exact")
            .eq("pin_id", pin_id)
            .execute()
        )
        likes_count = count_resp.count or 0

        return {"liked": liked, "likes_count": likes_count}
    except Exception as e:
        print(f"Error getting likes for pin {pin_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch like status")


@router.post("/cart/{pin_id}")
async def add_to_cart(
    pin_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase),
):
    """
    Add a pin to the current user's cart.

    Uses a `cart_items` table with columns:
      - id (uuid)
      - user_id (uuid)
      - pin_id (uuid)
      - created_at (timestamp)
    """
    try:
        # Check if already in cart
        existing = (
            supabase.table("cart_items")
            .select("*")
            .eq("user_id", user_id)
            .eq("pin_id", pin_id)
            .execute()
        )

        if existing.data:
            return {"message": "Already in cart"}

        supabase.table("cart_items").insert(
            {"user_id": user_id, "pin_id": pin_id}
        ).execute()

        return {"message": "Added to cart"}
    except Exception as e:
        print(f"Error adding pin {pin_id} to cart: {e}")
        raise HTTPException(status_code=500, detail="Failed to add to cart")


@router.delete("/cart/{pin_id}")
async def remove_from_cart(
    pin_id: str,
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase),
):
    """
    Remove a pin from the current user's cart.
    """
    try:
        supabase.table("cart_items") \
            .delete() \
            .eq("user_id", user_id) \
            .eq("pin_id", pin_id) \
            .execute()

        return {"message": "Removed from cart"}
    except Exception as e:
        print(f"Error removing pin {pin_id} from cart: {e}")
        raise HTTPException(status_code=500, detail="Failed to remove from cart")


@router.get("/cart")
async def get_cart(
    user_id: str = Depends(get_current_user_id),
    supabase: Client = Depends(get_supabase),
):
    """
    Get all cart items for the current user.

    Returns an object with `items`, where each item includes both
    the cart entry and the corresponding pin data.
    """
    try:
        cart_resp = (
            supabase.table("cart_items")
            .select("*")
            .eq("user_id", user_id)
            .execute()
        )
        cart_items = cart_resp.data or []

        if not cart_items:
            return {"items": []}

        pin_ids = [item["pin_id"] for item in cart_items]

        pins_resp = (
            supabase.table("pins")
            .select("*")
            .in_("id", pin_ids)
            .execute()
        )
        pins_by_id = {p["id"]: p for p in (pins_resp.data or [])}

        items = []
        for item in cart_items:
            pin = pins_by_id.get(item["pin_id"])
            if pin:
                items.append(
                    {
                        "cart_item": item,
                        "pin": pin,
                    }
                )

        return {"items": items}
    except Exception as e:
        print(f"Error fetching cart for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch cart")

