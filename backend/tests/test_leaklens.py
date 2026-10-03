import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.models.database import Base, get_db
from app.services.risk_engine import RiskEngine
from app.services.recommendation_engine import RecommendationEngine
from app.providers.base import RawIncident
from app.providers.demo_provider import DemoExposureProvider
from app.services.masking import mask_email, mask_username, hash_identifier, validate_email_format, validate_username_format

# In-memory test SQLite DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_leaklens.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

# 1. Validation Tests
def test_valid_and_invalid_email_validation():
    assert validate_email_format("student@example.com") is True
    assert validate_email_format("taniya.sharma@college.edu") is True
    assert validate_email_format("invalid-email") is False
    assert validate_email_format("user@.com") is False
    assert validate_email_format("@domain.com") is False

def test_valid_and_invalid_username_validation():
    assert validate_username_format("cyber_user") is True
    assert validate_username_format("admin.99") is True
    assert validate_username_format("ab") is False  # too short
    assert validate_username_format("user@special!") is False  # special chars disallowed

def test_masking_and_hashing():
    masked = mask_email("taniya@example.com")
    assert "ta***" in masked
    assert "@example.com" in masked
    
    masked_user = mask_username("security_admin")
    assert "se***in" in masked_user
    
    hashed = hash_identifier("test@example.com")
    assert len(hashed) == 64  # HMAC-SHA256 hex length

# 2. Exact Mathematical Risk Engine Audits
def test_safe_demo_exact_zero_and_factors():
    provider = DemoExposureProvider()
    incidents = provider.PREDEFINED_SCENARIOS["safe.demo@example.com"]
    result = RiskEngine.calculate_risk(incidents)
    
    assert result["score"] == 0
    assert result["raw_score"] == 0
    assert result["is_capped"] is False
    assert result["risk_level"] == "LOW"
    assert len(result["factors"]) == 1
    assert result["factors"][0]["points"] == 0
    assert sum(f["points"] for f in result["factors"]) == 0

def test_exposed_demo_exact_65_and_factor_sum():
    provider = DemoExposureProvider()
    incidents = provider.PREDEFINED_SCENARIOS["exposed.demo@example.com"]
    result = RiskEngine.calculate_risk(incidents)
    
    # Mathematical breakdown:
    # 2 incidents (+15) + Email (+10) + Username (+10) + IP (+10) + Metadata (+5) + Recency (+15) = 65
    assert result["score"] == 65
    assert result["raw_score"] == 65
    assert result["is_capped"] is False
    assert result["risk_level"] == "HIGH"
    
    # Sum of all displayed factors MUST equal exactly 65
    factor_sum = sum(f["points"] for f in result["factors"])
    assert factor_sum == 65
    assert len(result["factors"]) == 6

def test_highrisk_demo_exact_100_and_capping():
    provider = DemoExposureProvider()
    incidents = provider.PREDEFINED_SCENARIOS["highrisk.demo@example.com"]
    result = RiskEngine.calculate_risk(incidents)
    
    # Mathematical breakdown:
    # 3 incidents (+20) + Password indicator (+30) + Personal Info (+15) + Email (+10) + Username (+10) + IP (+10) + Recency (+15) = 110
    assert result["raw_score"] == 110
    assert result["score"] == 100
    assert result["is_capped"] is True
    assert result["risk_level"] == "CRITICAL"
    
    # Sum of uncapped factors equals raw score
    factor_sum = sum(f["points"] for f in result["factors"])
    assert factor_sum == 110
    assert min(factor_sum, 100) == 100

def test_deterministic_scoring_consistency():
    provider = DemoExposureProvider()
    incidents = provider.PREDEFINED_SCENARIOS["exposed.demo@example.com"]
    
    # Run calculation 50 times in loop to verify complete determinism
    first_res = RiskEngine.calculate_risk(incidents)
    for _ in range(50):
        iter_res = RiskEngine.calculate_risk(incidents)
        assert iter_res["score"] == first_res["score"]
        assert iter_res["raw_score"] == first_res["raw_score"]
        assert iter_res["factors"] == first_res["factors"]

def test_recommendation_priorities():
    incidents = [
        RawIncident(
            incident_name="Demo",
            incident_year=2025,
            categories=["Password-related data indicator"],
            severity="HIGH",
            source_type="Breach",
            description="Mock"
        )
    ]
    recs = RecommendationEngine.generate_recommendations(incidents, ["Password-related data indicator"], "CRITICAL")
    assert any(r["priority"] == "CRITICAL" for r in recs)
    assert any("Password" in r["title"] for r in recs)
    assert any(r["priority"] == "GENERAL" for r in recs)

# 3. API Endpoint Tests
def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"
    assert res.json()["service"] == "LeakLens"

def test_api_scan_safe_demo():
    res = client.post("/api/scan", json={"identifier": "safe.demo@example.com", "type": "email"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "no_exposure_found"
    assert data["risk_score"] == 0
    assert data["risk_level"] == "LOW"
    assert len(data["incidents"]) == 0

def test_api_scan_exposed_demo():
    res = client.post("/api/scan", json={"identifier": "exposed.demo@example.com", "type": "email"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "potential_exposure"
    assert len(data["incidents"]) == 2
    assert data["risk_score"] == 65
    assert data["risk_level"] == "HIGH"

def test_api_scan_highrisk_demo():
    res = client.post("/api/scan", json={"identifier": "highrisk.demo@example.com", "type": "email"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "potential_exposure"
    assert len(data["incidents"]) == 3
    assert data["risk_score"] == 100
    assert data["is_capped"] is True
    assert data["risk_level"] == "CRITICAL"

def test_api_scan_empty_input_error():
    res = client.post("/api/scan", json={"identifier": "   ", "type": "email"})
    assert res.status_code == 422 or res.status_code == 400

def test_api_scan_invalid_email_error():
    res = client.post("/api/scan", json={"identifier": "not-an-email", "type": "email"})
    assert res.status_code == 400
    assert "valid email address format" in res.json()["detail"]

def test_api_scan_password_prevention():
    res = client.post("/api/scan", json={"identifier": "secret=myPassword123", "type": "email"})
    assert res.status_code == 422 or res.status_code == 400

def test_api_history_and_dashboard():
    # Run a scan first
    client.post("/api/scan", json={"identifier": "exposed.demo@example.com", "type": "email"})
    
    # Check history
    hist_res = client.get("/api/history")
    assert hist_res.status_code == 200
    assert len(hist_res.json()) >= 1
    
    # Check dashboard
    dash_res = client.get("/api/dashboard")
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_scans"] >= 1
    assert dash_data["scans_with_exposure"] >= 1

def test_api_security_tips():
    res = client.get("/api/security-tips")
    assert res.status_code == 200
    assert len(res.json()) == 8  # 8 categories
