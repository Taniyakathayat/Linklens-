from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime

class ScanRequest(BaseModel):
    identifier: str = Field(..., description="Email address or username to assess")
    type: str = Field("email", description="Type of identifier: 'email' or 'username'")

    @field_validator("identifier")
    @classmethod
    def validate_identifier(cls, v: str) -> str:
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Please enter an email address or username.")
        if len(cleaned) > 255:
            raise ValueError("Identifier length exceeds the maximum limit of 255 characters.")
        # Strict defensive check: verify no password indicators are being pasted accidentally
        if any(keyword in cleaned.lower() for keyword in ["password=", "pass=", "secret=", "bearer "]):
            raise ValueError("Security Violation: Passwords or credentials must never be entered into LeakLens.")
        return cleaned

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        normalized = v.strip().lower()
        if normalized not in ["email", "username"]:
            raise ValueError("Identifier type must be either 'email' or 'username'.")
        return normalized


class RiskFactor(BaseModel):
    factor: str
    points: int
    description: str


class IncidentSchema(BaseModel):
    id: Optional[str] = None
    incident_name: str
    incident_year: Optional[int] = None
    incident_date: Optional[str] = None
    categories: List[str]
    severity: str = "MEDIUM"
    source_type: str = "Data Breach"
    description: Optional[str] = None


class RecommendationSchema(BaseModel):
    id: Optional[str] = None
    priority: str  # "CRITICAL", "HIGH", "MEDIUM", "GENERAL"
    title: str
    description: str
    action_category: str = "Account Security"
    completed: bool = False


class ScanResponse(BaseModel):
    scan_id: str
    identifier_hash: str
    masked_identifier: str
    identifier_type: str
    status: str  # "potential_exposure" | "no_exposure_found"
    status_label: str
    mode: str
    risk_score: int
    raw_score: Optional[int] = None
    is_capped: Optional[bool] = False
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    risk_summary: str
    risk_factors: List[RiskFactor]
    incidents: List[IncidentSchema]
    categories_summary: List[str]
    recommendations: List[RecommendationSchema]
    created_at: datetime
    disclaimer: str = (
        "This risk assessment is an educational evaluation based on configured records. "
        "The absence of a record does not guarantee immunity from cyber compromise."
    )


class HistoryItemSchema(BaseModel):
    scan_id: str
    identifier_hash: str
    masked_identifier: str
    identifier_type: str
    status: str
    risk_score: int
    risk_level: str
    incident_count: int
    mode: str
    created_at: datetime


class DashboardStatsSchema(BaseModel):
    total_scans: int
    scans_with_exposure: int
    clean_scans: int
    average_risk_score: float
    risk_level_distribution: Dict[str, int]
    top_exposed_categories: List[Dict[str, Any]]
    recent_activity: List[HistoryItemSchema]


class SecurityTipCategory(BaseModel):
    id: str
    title: str
    icon: str
    tips: List[Dict[str, str]]
