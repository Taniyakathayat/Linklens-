from typing import List, Dict, Any
from app.providers.base import RawIncident

class RecommendationEngine:
    """
    Context-aware security recommendation engine for LeakLens.
    Produces prioritized, actionable defensive steps tailored to specific detected threat vectors.
    """

    @classmethod
    def generate_recommendations(
        cls, 
        incidents: List[RawIncident], 
        categories: List[str], 
        risk_level: str
    ) -> List[Dict[str, Any]]:
        recs: List[Dict[str, Any]] = []
        lower_categories = [c.lower() for c in categories]
        incident_count = len(incidents)

        # 1. CRITICAL PRIORITY: Password & Credential Vectors
        has_password_indicator = any(
            "password" in c for c in lower_categories
        )
        if has_password_indicator or risk_level == "CRITICAL":
            recs.append({
                "priority": "CRITICAL",
                "title": "Immediate Password Rotation on Associated Accounts",
                "description": (
                    "Exposure records indicate password-related data or high-severity indicators. "
                    "Immediately update passwords for any account sharing this identifier. "
                    "Ensure you use a strong, unique passphrase and never submit passwords to verification tools."
                ),
                "action_category": "Credential Security",
                "completed": False
            })
            recs.append({
                "priority": "CRITICAL",
                "title": "Prevent Credential Stuffing Across Other Services",
                "description": (
                    "Threat actors often test breached combinations across other banking, social, and email portals. "
                    "Audit every critical online account and ensure no shared passwords exist."
                ),
                "action_category": "Credential Security",
                "completed": False
            })

        # 2. HIGH PRIORITY: Multi-Incident / Personal Data Exposure
        if incident_count >= 2 or any("personal" in c or "phone" in c for c in lower_categories):
            recs.append({
                "priority": "HIGH",
                "title": "Heightened Phishing & Social Engineering Vigilance",
                "description": (
                    "Because personal attributes and multiple account records were exposed, "
                    "expect targeted spear-phishing emails or SMS scams impersonating legitimate institutions. "
                    "Never click suspicious links or provide OTPs over the phone."
                ),
                "action_category": "Threat Awareness",
                "completed": False
            })
            recs.append({
                "priority": "HIGH",
                "title": "Audit & Terminate Dormant Accounts",
                "description": (
                    "Multiple exposures often stem from forgotten legacy services. "
                    "Identify old websites you no longer use and request complete account deletion."
                ),
                "action_category": "Data Minimization",
                "completed": False
            })

        # 3. MEDIUM PRIORITY: Specific Attribute Exposure
        if any("username" in c for c in lower_categories):
            recs.append({
                "priority": "MEDIUM",
                "title": "Decouple Public Usernames from Critical Services",
                "description": (
                    "Reusing the same username makes it trivial to link your digital identity across unrelated platforms. "
                    "Use distinct pseudonyms for public forums and separate emails for sensitive logins."
                ),
                "action_category": "Identity Privacy",
                "completed": False
            })

        if any("ip address" in c for c in lower_categories):
            recs.append({
                "priority": "MEDIUM",
                "title": "Network & Device Privacy Hardening",
                "description": (
                    "IP address exposure can correlate physical location or ISP metadata. "
                    "Utilize a trustworthy VPN when browsing on public networks and reboot your home router to refresh dynamic IP pools."
                ),
                "action_category": "Network Security",
                "completed": False
            })

        # 4. GENERAL / UNIVERSAL BEST PRACTICES (Always included)
        recs.append({
            "priority": "GENERAL",
            "title": "Enable Multi-Factor Authentication (MFA / 2FA)",
            "description": (
                "Turn on MFA (preferably using an Authenticator app or hardware security key rather than SMS) "
                "on your primary email, cloud storage, and financial accounts."
            ),
            "action_category": "Access Control",
            "completed": False
        })

        recs.append({
            "priority": "GENERAL",
            "title": "Adopt a Dedicated Password Manager",
            "description": (
                "Use a reputable password manager (e.g., Bitwarden, 1Password, or KeePass) to generate and store "
                "unique 16+ character passwords for every service."
            ),
            "action_category": "Cyber Hygiene",
            "completed": False
        })

        # If clean / zero incidents found:
        if not incidents:
            recs.insert(0, {
                "priority": "GENERAL",
                "title": "Maintain Continuous Cybersecurity Hygiene",
                "description": (
                    "While no recorded exposures were identified in configured databases, new breaches occur constantly. "
                    "Continue using unique passwords and enabling MFA proactively."
                ),
                "action_category": "Proactive Defense",
                "completed": False
            })

        # Sort strictly by priority hierarchy
        priority_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "GENERAL": 3}
        recs.sort(key=lambda x: priority_order.get(x["priority"], 4))

        return recs
