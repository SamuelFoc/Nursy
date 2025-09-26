from collections.abc import Generator

from sqlalchemy.orm import Session

from src.iqs_api.db.database import SessionLocal


def on_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
