from typing import List, Dict, Any, Tuple
from app.providers.base import RawIncident

class RiskEngine:
    """
    ==============================================================================
    LEAKLENS MATHEMATICAL RISK SCORING FORMULA (Academic Reference)
    ==============================================================================

      Raw Risk Score = (
          Base/Frequency Score
          + Data Sensitivity Category Score
          + Severity Impact Score
          + Temporal Recency Score
      )

      Final Risk Score = min(Raw Risk Score, 100)

    Factor Weights:
    1. Incident Frequency:
       - 0 incidents  = 0 pts
       - 1 incident   = +10 pts
       - 2 incidents  = +15 pts
       - 3+ incidents = +20 pts

    2. Data Sensitivity Categories (Evaluated on Unique Set of Exposed Classes):
       - Password-related indicator / Hashes: +30 pts
       - Financial / Credit Cards:            +25 pts
       - Personal Information (PII):          +15 pts
       - Phone Numbers:                       +15 pts
       - Email Address:                       +10 pts
       - Username:                            +10 pts
       - IP Address:                          +10 pts
       - Account Metadata / Device Info:      +5 pts

    3. Temporal Recency:
       - Exposure within <= 2 years (>= 2024): +15 pts

    4. Severity Tiers:
       - 0 – 30   : LOW
       - 31 – 60  : MEDIUM
       - 61 – 80  : HIGH
       - 81 – 100 : CRITICAL
    ==============================================================================
    """

    CURRENT_YEAR = 2026

    # Configurable point weights
    WEIGHT_INCIDENT_ONE = 10
    WEIGHT_INCIDENT_TWO = 15
    WEIGHT_INCIDENT_THREE_PLUS = 20

    CATEGORY_WEIGHTS = {
        "password-related data indicator": 30,
        "passwords": 30,
        "hashed passwords": 30,
        "financial information": 25,
        "credit cards": 25,
        "personal information": 15,
        "phone numbers": 15,
        "email": 10,
        "username": 10,
        "ip address": 10,
        "account metadata": 5,
        "device information": 5
    }

    RECENCY_THRESHOLD_YEARS = 2
    WEIGHT_RECENCY = 15

    @classmethod
    def calculate_risk(cls, incidents: List[RawIncident]) -> Dict[str, Any]:
        """
        Computes the aggregate risk score and detailed factor breakdown deterministically.
        Same input + same exposure records = identical risk score.
        """
        if not incidents:
            return {
                "raw_score": 0,
                "score": 0,
                "is_capped": False,
                "risk_level": "LOW",
                "summary": "No known exposure incidents found in configured sources. Basic baseline risk applies.",
                "factors": [
                    {
                        "factor": "Baseline Clean Record",
                        "points": 0,
                        "description": "Zero exposure incidents recorded in our threat database."
                    }
                ],
                "categories": []
            }

        raw_score = 0
        factors: List[Dict[str, Any]] = []
        incident_count = len(incidents)

        # 1. Base / Incident Frequency Score
        if incident_count == 1:
            raw_score += cls.WEIGHT_INCIDENT_ONE
            factors.append({
                "factor": "Single Exposure Incident",
                "points": cls.WEIGHT_INCIDENT_ONE,
                "description": "1 recorded data exposure incident detected (+10 pts frequency weight)."
            })
        elif incident_count == 2:
            raw_score += cls.WEIGHT_INCIDENT_TWO
            factors.append({
                "factor": "Multiple Exposure Incidents (2)",
                "points": cls.WEIGHT_INCIDENT_TWO,
                "description": "2 distinct data exposure incidents detected across services (+15 pts frequency weight)."
            })
        else:
            raw_score += cls.WEIGHT_INCIDENT_THREE_PLUS
            factors.append({
                "factor": f"High Exposure Frequency ({incident_count} Incidents)",
                "points": cls.WEIGHT_INCIDENT_THREE_PLUS,
                "description": f"{incident_count} separate breaches associated with this digital identifier (+20 pts frequency weight)."
            })

        # 2. Data Sensitivity Category Scores (evaluated on unique set)
        unique_categories = set()
        for inc in incidents:
            for cat in inc.categories:
                unique_categories.add(cat.strip())

        # Match categories deterministically (sorted order)
        applied_categories = set()
        for cat in sorted(list(unique_categories)):
            cat_lower = cat.lower()
            matched_key = None
            for key in cls.CATEGORY_WEIGHTS.keys():
                if key in cat_lower or cat_lower in key:
                    matched_key = key
                    break

            if matched_key and matched_key not in applied_categories:
                applied_categories.add(matched_key)
                pts = cls.CATEGORY_WEIGHTS[matched_key]
                raw_score += pts
                factors.append({
                    "factor": f"Exposed: {cat}",
                    "points": pts,
                    "description": f"Presence of '{cat}' in breached data sets increases vulnerability (+{pts} pts sensitivity)."
                })
            elif cat not in applied_categories:
                applied_categories.add(cat)
                pts = 5
                raw_score += pts
                factors.append({
                    "factor": f"Exposed: {cat}",
                    "points": pts,
                    "description": f"Exposed metadata class ({cat}) (+{pts} pts)."
                })

        # 3. Temporal Recency Score
        recent_found = False
        most_recent_year = None
        for inc in incidents:
            if inc.incident_year:
                if most_recent_year is None or inc.incident_year > most_recent_year:
                    most_recent_year = inc.incident_year
                if (cls.CURRENT_YEAR - inc.incident_year) <= cls.RECENCY_THRESHOLD_YEARS:
                    recent_found = True

        if recent_found:
            raw_score += cls.WEIGHT_RECENCY
            factors.append({
                "factor": "Recent Incident Temporal Impact",
                "points": cls.WEIGHT_RECENCY,
                "description": f"Exposure occurred recently ({most_recent_year}), indicating active threat viability (+{cls.WEIGHT_RECENCY} pts recency)."
            })

        # 4. Final Score Capping at 100
        is_capped = raw_score > 100
        final_score = min(raw_score, 100)

        # 5. Risk Tier Classification
        if final_score <= 30:
            risk_level = "LOW"
            summary = "Low overall risk. Minor footprint observed with minimal critical credential vectors."
        elif final_score <= 60:
            risk_level = "MEDIUM"
            summary = "Moderate risk. Exposure records suggest account metadata was compromised in historic events."
        elif final_score <= 80:
            risk_level = "HIGH"
            summary = "High risk. Multiple or sensitive exposure records detected. Password changes and MFA are strongly advised."
        else:
            risk_level = "CRITICAL"
            summary = (
                f"Critical risk. High frequency of exposures including sensitive password-related indicators. "
                f"(Raw score of {raw_score} capped at maximum scale of 100)."
                if is_capped else
                "Critical risk. High frequency of exposures including sensitive password-related indicators."
            )

        return {
            "raw_score": raw_score,
            "score": final_score,
            "is_capped": is_capped,
            "risk_level": risk_level,
            "summary": summary,
            "factors": factors,
            "categories": sorted(list(unique_categories))
        }
