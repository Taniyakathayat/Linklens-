# LeakLens Cyber Risk Scoring Methodology

## 1. Objective & Disclaimers
The LeakLens Risk Engine computes a transparent, educational **Cyber Risk Index (0–100)** to help non-technical users understand their exposure severity. 

> [!NOTE]
> **Academic Project Note:** This score is an application-defined educational risk index designed for threat prioritization. It is not an official ISO, NIST, or CVSS benchmark.

---

## 2. Formal Mathematical Scoring Formula

```text
Raw Risk Score = (
    Base/Frequency Score
    + Data Sensitivity Category Score
    + Severity Impact Score
    + Temporal Recency Score
)

Final Risk Score = min(Raw Risk Score, 100)
```

---

## 3. Factor Weights Breakdown

### A. Base / Incident Frequency Score
- **0 Incidents**: `0 Points`
- **1 Incident**: `+10 Points`
- **2 Incidents**: `+15 Points`
- **3+ Incidents**: `+20 Points`

### B. Data Sensitivity Category Weights (Evaluated on Unique Set)
| Data Category | Point Weight | Rationale |
|---|---|---|
| **Password-related indicator / Hashes** | `+30 Points` | Direct credential reuse and stuffing vulnerability |
| **Financial / Credit Cards** | `+25 Points` | High risk of direct fraud or identity theft |
| **Personal Information (PII)** | `+15 Points` | Social engineering, KYC impersonation |
| **Phone Numbers** | `+15 Points` | SIM-swapping, vishing, SMS phishing |
| **Email Address** | `+10 Points` | Targeted spear-phishing entry point |
| **Username** | `+10 Points` | Cross-platform correlation and deanonymization |
| **IP Address** | `+10 Points` | Geolocation and network targeting |
| **Account Metadata / Device Info** | `+5 Points` | Ancillary profile information |

### C. Temporal Recency Score
- **Recent Incident (≤ 2 Years Old / ≥ 2024)**: `+15 Points` (Reflects active credential viability on the dark web)

---

## 4. Mathematical Audit of Demo Scenarios

### Scenario A: Safe Demo (`safe.demo@example.com`)
- **Frequency**: 0 incidents (`0 pts`)
- **Sensitivity**: Clean record (`0 pts`)
- **Recency**: None (`0 pts`)
- **Raw Score**: `0 pts`
- **Final Score**: `min(0, 100) = 0 / 100 (LOW)`
- **Is Capped**: `False`

### Scenario B: Exposed Demo (`exposed.demo@example.com`)
- **Frequency**: 2 incidents (`+15 pts`)
- **Sensitivity**: Email (`+10`) + Username (`+10`) + IP Address (`+10`) + Account Metadata (`+5`) = `+35 pts`
- **Recency**: Year 2025 (`+15 pts`)
- **Raw Score**: `15 + 35 + 15 = 65 pts`
- **Final Score**: `min(65, 100) = 65 / 100 (HIGH)`
- **Is Capped**: `False`

### Scenario C: High Risk Demo (`highrisk.demo@example.com`)
- **Frequency**: 3 incidents (`+20 pts`)
- **Sensitivity**: Password indicator (`+30`) + Personal Info (`+15`) + Email (`+10`) + Username (`+10`) + IP Address (`+10`) = `+75 pts`
- **Recency**: Year 2025 (`+15 pts`)
- **Raw Score**: `20 + 75 + 15 = 110 pts`
- **Final Score**: `min(110, 100) = 100 / 100 (CRITICAL)`
- **Is Capped**: `True` (Raw score 110 is capped at maximum 100)

---

## 5. Severity Tier Mapping

| Score Range | Risk Level | Meaning & Posture |
|---|---|---|
| **0 – 30** | **LOW** | Clean record or minor non-critical metadata. Maintain proactive cyber hygiene. |
| **31 – 60** | **MEDIUM** | Historic or moderate metadata exposure. Strengthen usernames and monitor phishing. |
| **61 – 80** | **HIGH** | Multiple breach events or personal data exposed. Immediate MFA and password reviews required. |
| **81 – 100** | **CRITICAL** | Severe exposure involving password indicators or high-frequency leaks. Immediate credential rotation. |
