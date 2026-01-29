from pymongo import MongoClient
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Default categories shown when user adds an image (category dropdown)
DEFAULT_CATEGORIES = [
    'Geometric', 'Abstract', 'Floral', 'Stripes', 'Polka Dots',
    'Chevron', 'Mandala', 'Paisley', 'Damask', 'Brocade',
    'Jacobean', 'Art Deco', 'Art Nouveau', 'Bohemian', 'Botanical',
    'Celestial', 'Animal Prints', 'Aztec', 'Boho Chic', 'Celtic',
    'Chintz', 'Ditsy', 'Ethnic', 'Flora', 'Folk Art'
]

class DatabaseManager:
    def __init__(self):
        # Get MongoDB connection details from environment variables
        self.username = os.getenv('MONGODB_USERNAME', '')
        self.password = os.getenv('MONGODB_PASSWORD', '')
        self.cluster_url = os.getenv('MONGODB_CLUSTER_URL', '')  # e.g., 'cluster0.xxxxx.mongodb.net'
        self.database_name = os.getenv('MONGODB_DATABASE_NAME', 'creative_stock_db')
        
        # Try Atlas connection first
        atlas_connected = False
        if self.username and self.password and self.cluster_url and self.cluster_url != 'your-cluster-url.mongodb.net':
            try:
                escaped_username = quote_plus(self.username)
                escaped_password = quote_plus(self.password)
                self.connection_string = f"mongodb+srv://{escaped_username}:{escaped_password}@{self.cluster_url}/{self.database_name}?retryWrites=true&w=majority"
                self.client = MongoClient(self.connection_string, serverSelectionTimeoutMS=5000)
                # Test the connection
                self.client.admin.command('ping')
                self.db = self.client[self.database_name]
                atlas_connected = True
                print("Connected to MongoDB Atlas successfully")
            except Exception as e:
                print(f"Atlas connection failed: {e}")
                atlas_connected = False
        
        # Fallback to local MongoDB (short timeout so in-memory fallback is fast and reloader does not hang)
        if not atlas_connected:
            try:
                self.connection_string = "mongodb://localhost:27017/"
                self.client = MongoClient(self.connection_string, serverSelectionTimeoutMS=2000)
                self.client.admin.command('ping')
                self.db = self.client[self.database_name]
                print("Connected to local MongoDB successfully")
            except Exception as e:
                print(f"Local MongoDB connection failed: {e}")
                # Use in-memory storage as final fallback
                print("Using in-memory storage (no persistent data)")
                self.use_memory_storage = True
                self.pins_data = []
                self.categories_data = list(DEFAULT_CATEGORIES)
                print(f"Initialized with default categories: {self.categories_data}")
                return
        
        # Initialize collections if using database
        if not hasattr(self, 'use_memory_storage'):
            self.pins_collection = self.db.pins
            self.categories_collection = self.db.categories
            
            # Create indexes and seed default categories
            try:
                self._create_indexes()
                self._seed_default_categories()
            except Exception as e:
                print(f"Warning: Could not create indexes: {e}")
    
    def _seed_default_categories(self):
        """Seed default categories when using MongoDB if collection is empty."""
        if hasattr(self, 'use_memory_storage'):
            return
        try:
            if self.categories_collection.count_documents({}) == 0:
                for name in DEFAULT_CATEGORIES:
                    self.categories_collection.insert_one({"name": name})
                print(f"Seeded {len(DEFAULT_CATEGORIES)} default categories")
        except Exception as e:
            print(f"Warning: Could not seed categories: {e}")
    
    def _create_indexes(self):
        """Create indexes for better query performance"""
        if hasattr(self, 'use_memory_storage'):
            return
            
        try:
            # Index on title for search functionality
            self.pins_collection.create_index("title")
            # Index on category for filtering
            self.pins_collection.create_index("category")
            # Index on user for organization
            self.pins_collection.create_index("user")
            # Index on tags for search
            self.pins_collection.create_index("tags")
            
            # Index on category names
            self.categories_collection.create_index("name", unique=True)
        except Exception as e:
            print(f"Warning: Could not create indexes: {e}")
    
    def get_pins(self, category=None, search=None):
        """Get all pins with optional filtering"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            result = self.pins_data[:]
            if category:
                result = [pin for pin in result if pin.get('category') == category]
            if search:
                search_lower = search.lower()
                result = [pin for pin in result if 
                         search_lower in pin.get('title', '').lower() or
                         search_lower in pin.get('description', '').lower() or
                         search_lower in pin.get('user', '').lower() or
                         search_lower in [tag.lower() for tag in pin.get('tags', [])]]
            return result
        
        query = {}
        
        if category:
            query["category"] = category
            
        if search:
            search_lower = search.lower()
            query["$or"] = [
                {"title": {"$regex": search_lower, "$options": "i"}},
                {"description": {"$regex": search_lower, "$options": "i"}},
                {"user": {"$regex": search_lower, "$options": "i"}},
                {"tags": {"$in": [search_lower]}}
            ]
        
        return list(self.pins_collection.find(query))
    
    def get_pin_by_id(self, pin_id):
        """Get a specific pin by ID"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            for pin in self.pins_data:
                if str(pin.get('id', '')) == str(pin_id) or str(pin.get('_id', '')) == str(pin_id):
                    return pin
            return None
        
        from bson import ObjectId
        return self.pins_collection.find_one({"_id": ObjectId(pin_id)})
    
    def create_pin(self, pin_data):
        """Create a new pin"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            import uuid
            pin_with_id = {**pin_data, 'id': str(uuid.uuid4())}
            self.pins_data.append(pin_with_id)
            return pin_with_id
        
        result = self.pins_collection.insert_one(pin_data)
        return self.get_pin_by_id(result.inserted_id)
    
    def update_pin(self, pin_id, pin_data):
        """Update an existing pin"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            for i, pin in enumerate(self.pins_data):
                if str(pin.get('id', '')) == str(pin_id) or str(pin.get('_id', '')) == str(pin_id):
                    self.pins_data[i] = {**pin, **pin_data, 'id': pin.get('id', pin_id)}
                    return self.pins_data[i]
            return None
        
        from bson import ObjectId
        result = self.pins_collection.update_one(
            {"_id": ObjectId(pin_id)}, 
            {"$set": pin_data}
        )
        if result.matched_count > 0:
            return self.get_pin_by_id(pin_id)
        return None
    
    def delete_pin(self, pin_id):
        """Delete a pin"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            initial_length = len(self.pins_data)
            self.pins_data = [pin for pin in self.pins_data 
                             if str(pin.get('id', '')) != str(pin_id) and str(pin.get('_id', '')) != str(pin_id)]
            return len(self.pins_data) < initial_length
        
        from bson import ObjectId
        result = self.pins_collection.delete_one({"_id": ObjectId(pin_id)})
        return result.deleted_count > 0
    
    def get_categories(self):
        """Get all categories"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            return [{'name': cat} for cat in self.categories_data]
        
        return list(self.categories_collection.find({}, {"_id": 0, "name": 1}))
    
    def create_category(self, category_name):
        """Create a new category"""
        if hasattr(self, 'use_memory_storage'):
            # In-memory storage implementation
            if category_name not in self.categories_data:
                self.categories_data.append(category_name)
                return {"name": category_name}
            return None
        
        category_doc = {"name": category_name}
        try:
            result = self.categories_collection.insert_one(category_doc)
            return category_doc
        except Exception as e:
            # Handle duplicate key error
            return None
    
    def close_connection(self):
        """Close the database connection"""
        self.client.close()

# Global database instance
db_manager = DatabaseManager()