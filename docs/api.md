# LeakLens API Documentation

Base URL: `http://localhost:8000/api`
Interactive Swagger Docs: `http://localhost:8000/docs`

---

### 1. Health & Configuration
- **Endpoint**: `GET /api/health`
- **Description**: Returns system status, active provider mode, and privacy policies.
- **Sample Response**:
  ```json
  {
    "status": "healthy",
    "service": "LeakLens",
    "version": "1.0.0",
    "mode": "demo",
    "privacy_notice": "LeakLens is a defensive cybersecurity tool. Passwords are never collected or stored."
  }
  ```

---

### 2. Execute Exposure Scan
- **Endpoint**: `POST /api/scan`
- **Request Body**:
  ```json
  {
    "identifier": "exposed.demo@example.com",
    "type": "email"
  }
  ```
- **Sample Response**:
  ```json
  {
    "scan_id": "8a7c1b12-98e3-4bf0-a39c-ef1108253a6a",
    "identifier_hash": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    "masked_identifier": "ex***d@example.com",
    "identifier_type": "email",
    "status": "potential_exposure",
    "status_label": "Potential Exposure Detected",
    "mode": "demo",
    "risk_score": 60,
    "risk_level": "MEDIUM",
    "risk_summary": "Moderate risk. Exposure records suggest account metadata was compromised.",
    "risk_factors": [
      {
        "factor": "Multiple Exposure Incidents (2)",
        "points": 15,
        "description": "2 distinct data exposure incidents detected across services."
      }
    ],
    "incidents": [
      {
        "incident_name": "ExampleForum Demo Breach",
        "incident_year": 2024,
        "incident_date": "2024-04-18",
        "categories": ["Email", "Username", "IP Address", "Account Metadata"],
        "severity": "MEDIUM",
        "source_type": "Community Forum Leak",
        "description": "Synthetic educational record."
      }
    ],
    "categories_summary": ["Account Metadata", "Email", "IP Address", "Username"],
    "recommendations": [
      {
        "priority": "HIGH",
        "title": "Heightened Phishing & Social Engineering Vigilance",
        "description": "Expect targeted spear-phishing emails.",
        "action_category": "Threat Awareness",
        "completed": false
      }
    ],
    "created_at": "2026-09-30T10:00:00.000Z",
    "disclaimer": "This risk assessment is an educational evaluation based on configured records."
  }
  ```

---

### 3. Retrieve Scan Report
- **Endpoint**: `GET /api/scan/{scan_id}`
- **Description**: Retrieves a full historical scan report by its unique UUID.

---

### 4. Audit History & Metrics
- **`GET /api/history?limit=50`**: Retrieves privacy-preserved historical assessment items.
- **`DELETE /api/history`**: Wipes local assessment history.
- **`GET /api/dashboard`**: Aggregates telemetry stats (total scans, risk distribution, common categories).
- **`GET /api/security-tips`**: Returns categorized cybersecurity best practice guidelines.
