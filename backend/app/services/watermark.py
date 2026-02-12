from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import math


def add_watermark(image_bytes: bytes, watermark_text: str = "CreativeStock") -> tuple[bytes, bytes]:
    """
    Add a diagonal watermark to an image.
    
    Args:
        image_bytes: Original image as bytes
        watermark_text: Text to use as watermark (default: "CreativeStock")
    
    Returns:
        Tuple of (watermarked_image_bytes, original_image_bytes)
    """
    # Open the original image
    original_image = Image.open(BytesIO(image_bytes))
    
    # Convert to RGBA if not already (for transparency support)
    if original_image.mode != 'RGBA':
        original_image = original_image.convert('RGBA')
    
    # Create a copy for watermarking
    watermarked = original_image.copy()
    
    # Create a transparent overlay for the watermark
    overlay = Image.new('RGBA', watermarked.size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(overlay)
    
    # Calculate font size based on image dimensions (3% of image width)
    font_size = int(watermarked.width * 0.03)
    
    try:
        # Try to use a system font
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        # Fallback to default font if arial not available
        font = ImageFont.load_default()
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), watermark_text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Calculate diagonal angle
    diagonal_angle = math.degrees(math.atan2(watermarked.height, watermarked.width))
    
    # Create a larger canvas for rotated text
    diagonal_length = int(math.sqrt(watermarked.width**2 + watermarked.height**2))
    text_image = Image.new('RGBA', (diagonal_length, diagonal_length), (255, 255, 255, 0))
    text_draw = ImageDraw.Draw(text_image)
    
    # Draw multiple watermarks diagonally across the image
    spacing = int(diagonal_length / 4)
    for i in range(-2, 3):
        y_position = diagonal_length // 2 + i * spacing
        text_draw.text(
            (diagonal_length // 2 - text_width // 2, y_position - text_height // 2),
            watermark_text,
            font=font,
            fill=(255, 255, 255, 80)  # White with 30% opacity
        )
    
    # Rotate the text image
    rotated_text = text_image.rotate(diagonal_angle, expand=False)
    
    # Calculate position to center the rotated watermark
    x = (watermarked.width - rotated_text.width) // 2
    y = (watermarked.height - rotated_text.height) // 2
    
    # Paste the watermark onto the overlay
    overlay.paste(rotated_text, (x, y), rotated_text)
    
    # Composite the overlay onto the image
    watermarked = Image.alpha_composite(watermarked, overlay)
    
    # Convert back to RGB for JPEG compatibility
    if watermarked.mode == 'RGBA':
        # Create white background
        rgb_image = Image.new('RGB', watermarked.size, (255, 255, 255))
        rgb_image.paste(watermarked, mask=watermarked.split()[3])  # Use alpha channel as mask
        watermarked = rgb_image
    
    # Save watermarked image to bytes
    watermarked_io = BytesIO()
    watermarked.save(watermarked_io, format='JPEG', quality=95)
    watermarked_bytes = watermarked_io.getvalue()
    
    # Save original image to bytes (convert to RGB for JPEG)
    original_rgb = original_image.convert('RGB') if original_image.mode == 'RGBA' else original_image
    original_io = BytesIO()
    original_rgb.save(original_io, format='JPEG', quality=100)
    original_bytes = original_io.getvalue()
    
    return watermarked_bytes, original_bytes


def apply_watermark_to_file(file_content: bytes) -> tuple[bytes, bytes]:
    """
    Convenience function to apply watermark to uploaded file content.
    
    Args:
        file_content: Raw file bytes
    
    Returns:
        Tuple of (watermarked_bytes, original_bytes)
    """
    return add_watermark(file_content)
