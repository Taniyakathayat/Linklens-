import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    create_engine, Column, String, Integer, DateTime, Boolean, ForeignKey, Text, JSON
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from app.config import settings

# Engine setup
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Scan(Base):
    __tablename__ = "scans"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    identifier_hash = Column(String(64), nullable=False, index=True)  # SHA-256 for privacy
    masked_identifier = Column(String(255), nullable=False)
    identifier_type = Column(String(20), nullable=False)  # "email" or "username"
    status = Column(String(50), nullable=False)  # "potential_exposure" or "no_exposure_found"
    mode = Column(String(20), default="demo")  # "demo" or "external"
    created_at = Column(DateTime, default=utc_now, index=True)

    # Relationships
    risk_assessment = relationship("RiskAssessment", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    incidents = relationship("ExposureIncident", back_populates="scan", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="scan", cascade="all, delete-orphan")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    scan_id = Column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False, unique=True)
    score = Column(Integer, nullable=False)  # 0 to 100
    risk_level = Column(String(20), nullable=False)  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    summary = Column(Text, nullable=True)
    factors_json = Column(JSON, nullable=True)  # Detailed list of scoring factors
    created_at = Column(DateTime, default=utc_now)

    scan = relationship("Scan", back_populates="risk_assessment")


class ExposureIncident(Base):
    __tablename__ = "exposure_incidents"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    scan_id = Column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    incident_name = Column(String(255), nullable=False)
    incident_year = Column(Integer, nullable=True)
    incident_date = Column(String(50), nullable=True)
    categories = Column(JSON, nullable=False)  # List of exposed categories e.g. ["Email", "Username"]
    severity = Column(String(20), default="MEDIUM")
    source_type = Column(String(50), default="Data Breach")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    scan = relationship("Scan", back_populates="incidents")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(String(36), primary_key=True, default=generate_uuid, index=True)
    scan_id = Column(String(36), ForeignKey("scans.id", ondelete="CASCADE"), nullable=False)
    priority = Column(String(20), nullable=False)  # "CRITICAL", "HIGH", "MEDIUM", "GENERAL"
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    action_category = Column(String(50), default="Account Security")
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    scan = relationship("Scan", back_populates="recommendations")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    Base.metadata.create_all(bind=engine)
