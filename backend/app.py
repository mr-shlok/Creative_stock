from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os
from bson import ObjectId
from werkzeug.utils import secure_filename
from db.database import db_manager
from PIL import Image, ImageDraw, ImageFont

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure upload settings (absolute path so uploads work regardless of cwd)
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(_BASE_DIR, 'uploads')
ORIGINALS_FOLDER = os.path.join(UPLOAD_FOLDER, 'originals')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

# Thin, elegant sans-serif fonts (wide letter-spacing feel)
WATERMARK_FONTS = [
    ('segoeuil.ttf', 'Segoe UI Light'),
    ('arial.ttf', 'Arial'),
    ('C:\\Windows\\Fonts\\segoeuil.ttf', 'Segoe UI Light'),
    ('C:\\Windows\\Fonts\\arial.ttf', 'Arial'),
]

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create upload and originals directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ORIGINALS_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def _get_watermark_font(size):
    """Load thin sans-serif font; fallback to default."""
    for path, _ in WATERMARK_FONTS:
        try:
            return ImageFont.truetype(path, size)
        except (OSError, IOError):
            continue
    return ImageFont.load_default()

def _draw_text_letter_spaced(draw, x, y, text, font, fill, letter_spacing_ratio=0.35):
    """Draw text with wide letter spacing (premium stock watermark style)."""
    spacing = int(font.size * letter_spacing_ratio)
    for i, char in enumerate(text):
        draw.text((x, y), char, font=font, fill=fill)
        bbox = draw.textbbox((x, y), char, font=font)
        x = bbox[2] + spacing
    return x

def add_watermark(image_path, watermark_text="CREATIVE STOCK"):
    """Add premium, minimal stock-photo watermark: corner + diagonal pattern.
    Adaptive color (white on dark / black on light), thin font, wide letter spacing,
    semi-transparent. Non-distracting, professional (Shutterstock/Adobe Stock style).
    """
    try:
        image = Image.open(image_path).copy()
        if image.mode not in ('RGBA', 'RGB'):
            image = image.convert('RGB')
        if image.mode != 'RGBA':
            image = image.convert('RGBA')

        def get_average_brightness(img):
            gs = img.convert('L')
            return sum(gs.getdata()) / max(len(gs.getdata()), 1)

        avg_brightness = get_average_brightness(image)
        # Adaptive: white/light gray on dark, black/dark gray on light
        if avg_brightness < 128:
            corner_color = (255, 255, 255, 48)
            pattern_color = (255, 255, 255, 12)
        else:
            corner_color = (40, 40, 40, 48)
            pattern_color = (40, 40, 40, 12)

        w, h = image.size
        corner_layer = Image.new('RGBA', (w, h), (255, 255, 255, 0))
        pattern_layer = Image.new('RGBA', (w, h), (255, 255, 255, 0))
        corner_draw = ImageDraw.Draw(corner_layer)

        # Corner: small, subtle, bottom-right — thin font, letter spacing
        corner_font_size = max(14, min(w // 28, h // 28))
        corner_font = _get_watermark_font(corner_font_size)
        # Measure text with spacing for positioning
        corner_text_width = 0
        for char in watermark_text:
            bbox = corner_draw.textbbox((0, 0), char, font=corner_font)
            corner_text_width += (bbox[2] - bbox[0]) + int(corner_font_size * 0.35)
        corner_text_width -= int(corner_font_size * 0.35)
        corner_bbox = corner_draw.textbbox((0, 0), "Ay", font=corner_font)
        corner_text_height = corner_bbox[3] - corner_bbox[1]
        pad = max(12, min(w, h) // 40)
        corner_x = w - corner_text_width - pad
        corner_y = h - corner_text_height - pad
        _draw_text_letter_spaced(corner_draw, corner_x, corner_y, watermark_text, corner_font, corner_color)

        # Diagonal pattern: rotated "CREATIVE STOCK" tiles, very low opacity
        pattern_font_size = max(11, min(w // 35, h // 35))
        pattern_font = _get_watermark_font(pattern_font_size)
        # Build a single tile: text on transparent, then rotate
        tile_w = 320
        tile_h = 120
        tile = Image.new('RGBA', (tile_w, tile_h), (255, 255, 255, 0))
        tile_draw = ImageDraw.Draw(tile)
        _draw_text_letter_spaced(tile_draw, 10, (tile_h - pattern_font_size) // 2, watermark_text, pattern_font, pattern_color)
        angle = -30
        tile_rot = tile.rotate(angle, expand=True, resample=Image.BICUBIC)
        tw, th = tile_rot.size
        step_x = max(tw // 2, 140)
        step_y = max(th // 2, 80)
        for py in range(-th, h + th, step_y):
            for px in range(-tw, w + tw, step_x):
                pattern_layer.paste(tile_rot, (px, py), tile_rot)

        # Composite: pattern first, then corner
        image = Image.alpha_composite(image, pattern_layer)
        image = Image.alpha_composite(image, corner_layer)

        # Save: preserve format, quality for JPEG
        ext = os.path.splitext(image_path)[1].lower()
        if ext in ('.jpg', '.jpeg'):
            image = image.convert('RGB')
            image.save(image_path, 'JPEG', quality=92, optimize=True)
        elif ext == '.png':
            image.save(image_path, 'PNG', optimize=True)
        elif ext == '.webp':
            image.save(image_path, 'WEBP', quality=90, method=6)
        else:
            image = image.convert('RGB')
            image.save(image_path, 'JPEG', quality=92, optimize=True)
        return True
    except Exception as e:
        print(f"Watermark error: {str(e)}")
        return False

# Simple admin authentication
ADMIN_CREDENTIALS = {
    "email": "admin@creativestock.com",
    "password": "admin123"
}

@app.route('/api/pins', methods=['GET'])
def get_pins():
    """Get all pins with optional filtering"""
    category = request.args.get('category')
    search = request.args.get('search')
    
    pins = db_manager.get_pins(category=category, search=search)
    
    # Normalize pin id for frontend (use _id as id when id missing)
    for pin in pins:
        if '_id' in pin:
            pin['_id'] = str(pin['_id'])
            pin['id'] = pin['_id']
        elif 'id' in pin:
            pin['_id'] = str(pin['id'])
        
        if 'tags' not in pin:
            pin['tags'] = []
        if 'price' not in pin:
            pin['price'] = 0
        if 'currency' not in pin:
            pin['currency'] = 'INR'
    
    return jsonify(pins)

@app.route('/api/pins/<pin_id>', methods=['GET'])
def get_pin(pin_id):
    """Get a specific pin by ID"""
    pin = db_manager.get_pin_by_id(pin_id)
    if pin:
        if '_id' in pin:
            pin['_id'] = str(pin['_id'])
            pin['id'] = pin['_id']
        elif 'id' in pin:
            pin['_id'] = str(pin['id'])
        
        if 'tags' not in pin:
            pin['tags'] = []
        if 'price' not in pin:
            pin['price'] = 0
        if 'currency' not in pin:
            pin['currency'] = 'INR'
        return jsonify(pin)
    return jsonify({'error': 'Pin not found'}), 404

@app.route('/api/pins', methods=['POST'])
def create_pin():
    """Create a new pin (admin only)"""
    data = request.get_json()
    
    # Prepare the pin data (image = watermarked, imageOriginal = for Buy Now / download)
    pin_data = {
        'title': data.get('title'),
        'image': data.get('image'),
        'imageOriginal': data.get('imageOriginal'),
        'user': data.get('user'),
        'category': data.get('category'),
        'description': data.get('description', ''),
        'tags': data.get('tags', []),
        'price': data.get('price', 0),
        'currency': data.get('currency', 'INR'),
        'likes': 0,
        'saves': 0,
        'shares': 0,
        'created_at': datetime.utcnow().isoformat() + 'Z'
    }
    
    new_pin = db_manager.create_pin(pin_data)
    if new_pin:
        # Handle both _id and id fields for compatibility
        if '_id' in new_pin:
            new_pin['_id'] = str(new_pin['_id'])
        elif 'id' in new_pin:
            new_pin['_id'] = str(new_pin['id'])
        return jsonify(new_pin), 201
    else:
        return jsonify({'error': 'Failed to create pin'}), 500

@app.route('/api/pins/<pin_id>', methods=['PUT'])
def update_pin(pin_id):
    """Update an existing pin (admin only)"""
    data = request.get_json()
    
    # Prepare the pin data
    pin_data = {
        'title': data.get('title'),
        'image': data.get('image'),
        'imageOriginal': data.get('imageOriginal'),
        'user': data.get('user'),
        'category': data.get('category'),
        'description': data.get('description', ''),
        'tags': data.get('tags', []),
        'price': data.get('price', 0),
        'currency': data.get('currency', 'INR'),
        'likes': data.get('likes', 0),
        'saves': data.get('saves', 0),
        'shares': data.get('shares', 0)
    }
    
    updated_pin = db_manager.update_pin(pin_id, pin_data)
    if updated_pin:
        if '_id' in updated_pin:
            updated_pin['_id'] = str(updated_pin['_id'])
            updated_pin['id'] = updated_pin['_id']
        elif 'id' in updated_pin:
            updated_pin['_id'] = str(updated_pin['id'])
        return jsonify(updated_pin)
    
    return jsonify({'error': 'Pin not found'}), 404

@app.route('/api/pins/<pin_id>', methods=['DELETE'])
def delete_pin(pin_id):
    """Delete a pin (admin only)"""
    success = db_manager.delete_pin(pin_id)
    if success:
        return jsonify({'message': 'Pin deleted successfully'})
    
    return jsonify({'error': 'Pin not found'}), 404

@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all categories"""
    categories = db_manager.get_categories()
    # Return just the names
    category_names = [cat['name'] for cat in categories]
    return jsonify(category_names)

@app.route('/api/categories', methods=['POST'])
def create_category():
    """Create a new category (admin only)"""
    data = request.get_json()
    category_name = data.get('name')
    
    if category_name:
        category = db_manager.create_category(category_name)
        if category:
            return jsonify(category), 201
        else:
            return jsonify({'error': 'Category already exists or invalid name'}), 400
    
    return jsonify({'error': 'Category name is required'}), 400

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Upload image file endpoint"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to avoid filename conflicts
            name, ext = os.path.splitext(filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_filename = f"{name}_{timestamp}{ext}"
            
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            originals_path = os.path.join(ORIGINALS_FOLDER, unique_filename)
            file.save(file_path)
            try:
                import shutil
                shutil.copy2(file_path, originals_path)
            except Exception as e:
                print("Warning: Could not save original:", e)
            watermark_success = False
            try:
                watermark_success = add_watermark(file_path, "CREATIVE STOCK")
            except Exception as wm_err:
                print("Warning: Watermark error (image kept without watermark):", wm_err)
            file_url = f"/uploads/{unique_filename}"
            original_url = f"/uploads/originals/{unique_filename}"
            return jsonify({
                'success': True,
                'filename': unique_filename,
                'url': file_url,
                'originalUrl': original_url,
                'watermarked': watermark_success
            })
        else:
            return jsonify({'error': 'File type not allowed'}), 400
            
    except Exception as e:
        return jsonify({'error': f'Upload failed: {str(e)}'}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Admin login endpoint"""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if email == ADMIN_CREDENTIALS['email'] and password == ADMIN_CREDENTIALS['password']:
        return jsonify({
            'success': True,
            'token': 'fake-jwt-token-for-demo-purposes'
        })
    
    return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

# Serve uploaded files (watermarked)
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        return jsonify({'error': f'File not found: {str(e)}'}), 404

# Serve original (unwatermarked) files
@app.route('/uploads/originals/<filename>')
def uploaded_original(filename):
    try:
        return send_from_directory(ORIGINALS_FOLDER, filename)
    except Exception as e:
        return jsonify({'error': f'File not found: {str(e)}'}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)