import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from app import create_app, db

def init_database():
    """Create all database tables"""
    app = create_app('production')
    
    with app.app_context():
        print("🔄 Creating database tables...")
        db.create_all()
        print("✅ All tables created successfully!")
        
        # Verify
        inspector = db.inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"📋 Tables: {', '.join(tables)}")

if __name__ == '__main__':
    init_database()
