import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = os.getenv('DB_PATH', str(BASE_DIR / 'local.db'))
DATABASE_URL = f'sqlite://{DB_PATH}'

engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
