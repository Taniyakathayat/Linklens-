# LeakLens Database Architecture

LeakLens uses **SQLAlchemy 2.0 ORM** with native support for both **PostgreSQL** (production/docker) and **SQLite** (instant local development).

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    SCANS ||--|| RISK_ASSESSMENTS : "has one"
    SCANS ||--o{ EXPOSURE_INCIDENTS : "contains"
    SCANS ||--o{ RECOMMENDATIONS : "generates"

    SCANS {
        string id PK "UUID"
        string identifier_hash "SHA-256 Digest"
        string masked_identifier "e.g. ta***@example.com"
        string identifier_type "email | username"
        string status "potential_exposure | no_exposure_found"
        string mode "demo | external"
        datetime created_at "Indexed"
    }

    RISK_ASSESSMENTS {
        string id PK "UUID"
        string scan_id FK "References scans.id"
        int score "0 to 100"
        string risk_level "LOW | MEDIUM | HIGH | CRITICAL"
        text summary
        json factors_json "Array of factor objects"
        datetime created_at
    }

    EXPOSURE_INCIDENTS {
        string id PK "UUID"
        string scan_id FK "References scans.id"
        string incident_name
        int incident_year
        string incident_date
        json categories "Array of exposed categories"
        string severity "LOW | MEDIUM | HIGH | CRITICAL"
        string source_type
        text description
        datetime created_at
    }

    RECOMMENDATIONS {
        string id PK "UUID"
        string scan_id FK "References scans.id"
        string priority "CRITICAL | HIGH | MEDIUM | GENERAL"
        string title
        text description
        string action_category
        boolean completed
        datetime created_at
    }
```

## Privacy Design
1. Raw identifiers are never stored unmasked in the database.
2. The `identifier_hash` column allows deduplication and lookup via cryptographic SHA-256.
3. Foreign keys enforce `ON DELETE CASCADE` so wiping history removes all associated records cleanly.
