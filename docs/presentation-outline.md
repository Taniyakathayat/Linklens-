# LeakLens College Presentation Slide Outline (12 Slides)

## Slide 1: Title Slide
- **Title**: LEAKLENS
- **Subtitle**: Personal Data Exposure & Cyber Risk Assessment Tool
- **Project Type**: BCA 5th-Semester Minor Project in Defensive Cybersecurity
- **Presenter**: [Your Name / Roll No.]

---

## Slide 2: Problem Statement
- Exponential growth of global data breaches leaking billions of user credentials.
- Users are unaware when their digital identity (email, username, IP) is exposed.
- Existing breach notifications are cryptic, lack risk context, and cause panic.

---

## Slide 3: Motivation & Objectives
- Transform complex, unstructured breach feeds into an understandable 0–100 Cyber Risk Index.
- Provide prioritized, actionable security steps to prevent account takeover.
- Maintain absolute user privacy: **Never collect or store passwords**.

---

## Slide 4: Existing System vs. Proposed System
| Feature | Traditional Breach Checkers | LeakLens Proposed System |
|---|---|---|
| Approach | Raw binary check ("Pwned / Not Pwned") | Multi-factor Cyber Risk Assessment (0–100) |
| Risk Transparency | None | Explains every point factor (+10, +15, +30) |
| Recommendations | Generic text | Ranked by priority (CRITICAL, HIGH, MEDIUM) |
| Presentation Mode | Requires live API keys | Offline Deterministic Synthetic Demo Mode |

---

## Slide 5: System Architecture
- **Frontend**: React.js 18, Vite, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Python 3.12, FastAPI, Pydantic v2, Uvicorn
- **Database**: PostgreSQL / SQLite with SQLAlchemy 2.0 ORM
- **Security**: SHA-256 Hashing, Masking, Regex validation, CORS

---

## Slide 6: System Processing Pipeline (5 Stages)
1. **INPUT**: Email or username entered in the web console.
2. **VALIDATION**: Pydantic format verification + automated password rejection.
3. **EXPOSURE CHECK**: Querying synthetic demo records or external threat feeds.
4. **RISK ANALYSIS**: Rule-based calculation factoring frequency, category weights, and recency.
5. **RECOMMENDATIONS**: Contextual defense guidelines and interactive checklist.

---

## Slide 7: Cyber Risk Scoring Engine
- **Base Score**: 0
- **Incident Count**: 1 incident (+10), 2 incidents (+15), 3+ incidents (+20)
- **Categories**: Email (+10), Username (+10), IP (+10), PII (+15), Password-indicator (+30)
- **Recency**: Incident ≤ 2 years old (+15)
- **Tiers**: 0–30 (LOW), 31–60 (MEDIUM), 61–80 (HIGH), 81–100 (CRITICAL)

---

## Slide 8: Demonstration Scenarios
1. **Safe Demo (`safe.demo@example.com`)**: 0 breaches, Risk Score 0 (LOW), Proactive cyber hygiene advice.
2. **Exposed Demo (`exposed.demo@example.com`)**: 2 breaches (Forum, Store), Risk Score 60 (MEDIUM), Phishing vigilance.
3. **High Risk Demo (`highrisk.demo@example.com`)**: 3 breaches with password indicator, Risk Score 95 (CRITICAL), Immediate password rotation.

---

## Slide 9: Defensive Security & Privacy First
- Zero collection or display of actual passwords or stolen secrets.
- Masked identifiers (`ta***@example.com`) in all reports.
- SHA-256 cryptographic hashing in local databases.
- Single-click audit trail wipe.

---

## Slide 10: Security Telemetry & Dashboard
- Aggregated threat statistics across all evaluated identifiers.
- Recharts visualizations: Top Compromised Data Categories & Risk Tier Distribution.
- Interactive local Security Improvement Checklist.

---

## Slide 11: Limitations & Future Enhancements
- **Limitations**: Risk score is an educational index, not an ISO/NIST standard.
- **Future Scope**:
  - Integration with k-Anonymity password hash verification.
  - Domain-level organization monitoring.
  - Automated dark-web notification webhooks.

---

## Slide 12: Conclusion & Q&A
- LeakLens delivers an accessible, privacy-preserving cyber defense assessment tool.
- Successfully bridges the gap between raw threat intelligence and user actionability.
- Open for Questions & Demonstration!
