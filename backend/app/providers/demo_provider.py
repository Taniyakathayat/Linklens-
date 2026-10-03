import hashlib
from typing import List
from app.providers.base import ExposureProvider, ExposureResult, RawIncident

class DemoExposureProvider(ExposureProvider):
    """
    Synthetic Demo Provider for educational simulation and college evaluation.
    Guarantees no real credentials or sensitive breach feeds are queried in demo mode.
    """

    PREDEFINED_SCENARIOS = {
        "safe.demo@example.com": [],
        "safe_user": [],
        "clean.test@example.com": [],
        
        "exposed.demo@example.com": [
            RawIncident(
                incident_name="ExampleForum Demo Breach",
                incident_year=2024,
                incident_date="2024-04-18",
                categories=["Email", "Username", "IP Address", "Account Metadata"],
                severity="MEDIUM",
                source_type="Community Forum Leak",
                description="Synthetic educational record simulating an unencrypted community discussion forum database leak."
            ),
            RawIncident(
                incident_name="DemoShopping Platform Incident",
                incident_year=2025,
                incident_date="2025-01-12",
                categories=["Email", "Username"],
                severity="LOW",
                source_type="E-Commerce API Exposure",
                description="Synthetic educational record simulating customer catalog scraping and exposed user metadata."
            )
        ],
        "exposed_user": [
            RawIncident(
                incident_name="ExampleForum Demo Breach",
                incident_year=2024,
                incident_date="2024-04-18",
                categories=["Email", "Username", "IP Address", "Account Metadata"],
                severity="MEDIUM",
                source_type="Community Forum Leak",
                description="Synthetic educational record simulating an unencrypted community discussion forum database leak."
            ),
            RawIncident(
                incident_name="DemoShopping Platform Incident",
                incident_year=2025,
                incident_date="2025-01-12",
                categories=["Email", "Username"],
                severity="LOW",
                source_type="E-Commerce API Exposure",
                description="Synthetic educational record simulating customer catalog scraping and exposed user metadata."
            )
        ],

        "highrisk.demo@example.com": [
            RawIncident(
                incident_name="FinTech Global Demo Leak",
                incident_year=2025,
                incident_date="2025-02-14",
                categories=["Email", "Username", "IP Address", "Password-related data indicator", "Personal Information"],
                severity="CRITICAL",
                source_type="Financial Web Portal Exposure",
                description="Synthetic educational record simulating an exposed backend database containing salt/hash digest indicators and personal profile information."
            ),
            RawIncident(
                incident_name="HealthPortal Archive Incident",
                incident_year=2024,
                incident_date="2024-08-20",
                categories=["Email", "Username", "Personal Information"],
                severity="HIGH",
                source_type="Cloud Storage Misconfiguration",
                description="Synthetic educational record simulating an open S3 bucket containing archived account registrations."
            ),
            RawIncident(
                incident_name="CloudSync Storage Breach",
                incident_year=2023,
                incident_date="2023-11-05",
                categories=["Email", "IP Address", "Password-related data indicator"],
                severity="HIGH",
                source_type="Credential Stuffing Vector",
                description="Synthetic educational record simulating credential dump correlation across third-party file sync accounts."
            )
        ],
        "highrisk_admin": [
            RawIncident(
                incident_name="FinTech Global Demo Leak",
                incident_year=2025,
                incident_date="2025-02-14",
                categories=["Email", "Username", "IP Address", "Password-related data indicator", "Personal Information"],
                severity="CRITICAL",
                source_type="Financial Web Portal Exposure",
                description="Synthetic educational record simulating an exposed backend database containing salt/hash digest indicators and personal profile information."
            ),
            RawIncident(
                incident_name="HealthPortal Archive Incident",
                incident_year=2024,
                incident_date="2024-08-20",
                categories=["Email", "Username", "Personal Information"],
                severity="HIGH",
                source_type="Cloud Storage Misconfiguration",
                description="Synthetic educational record simulating an open S3 bucket containing archived account registrations."
            ),
            RawIncident(
                incident_name="CloudSync Storage Breach",
                incident_year=2023,
                incident_date="2023-11-05",
                categories=["Email", "IP Address", "Password-related data indicator"],
                severity="HIGH",
                source_type="Credential Stuffing Vector",
                description="Synthetic educational record simulating credential dump correlation across third-party file sync accounts."
            )
        ]
    }

    async def get_exposure(self, identifier: str, identifier_type: str) -> ExposureResult:
        normalized = identifier.strip().lower()
        
        # Check predefined scenarios
        if normalized in self.PREDEFINED_SCENARIOS:
            incidents = self.PREDEFINED_SCENARIOS[normalized]
            return ExposureResult(
                is_exposed=len(incidents) > 0,
                incidents=incidents,
                provider_name="LeakLens Synthetic Demo Engine",
                mode="demo",
                source_notes="Pre-configured academic demonstration record (Safe for presentation)"
            )
        
        # Heuristic keywords for intuitive demo tests
        if any(w in normalized for w in ["safe", "clean", "secure", "testzero", "virgin"]):
            return ExposureResult(
                is_exposed=False,
                incidents=[],
                provider_name="LeakLens Synthetic Demo Engine",
                mode="demo",
                source_notes="No synthetic records generated for safe demo pattern"
            )
            
        if any(w in normalized for w in ["high", "critical", "pwn", "danger", "breached"]):
            incidents = self.PREDEFINED_SCENARIOS["highrisk.demo@example.com"]
            return ExposureResult(
                is_exposed=True,
                incidents=incidents,
                provider_name="LeakLens Synthetic Demo Engine",
                mode="demo",
                source_notes="High-risk synthetic demonstration pattern matched"
            )

        # Deterministic simulation for any arbitrary input:
        # Use MD5/SHA to consistently assign 0, 1, or 2 mock incidents
        h_val = int(hashlib.md5(normalized.encode("utf-8")).hexdigest(), 16)
        scenario_idx = h_val % 4
        
        if scenario_idx == 0:
            # Deterministic Safe Result
            incidents = []
        elif scenario_idx in [1, 2]:
            # Deterministic Moderate Exposure
            incidents = [
                RawIncident(
                    incident_name="DemoApp Services 2024",
                    incident_year=2024,
                    incident_date="2024-06-10",
                    categories=["Email", "Username", "IP Address"],
                    severity="MEDIUM",
                    source_type="Database Exfiltration",
                    description="Synthetic educational demonstration record generated deterministically for testing."
                )
            ]
        else:
            # Deterministic Multi-Incident Exposure
            incidents = [
                RawIncident(
                    incident_name="CyberForum Archive 2023",
                    incident_year=2023,
                    incident_date="2023-09-15",
                    categories=["Email", "Username"],
                    severity="MEDIUM",
                    source_type="API Leak",
                    description="Synthetic educational demonstration record generated deterministically for testing."
                ),
                RawIncident(
                    incident_name="GlobalMarketing Network 2025",
                    incident_year=2025,
                    incident_date="2025-01-30",
                    categories=["Email", "Personal Information", "Password-related data indicator"],
                    severity="HIGH",
                    source_type="Storage Exposure",
                    description="Synthetic educational demonstration record generated deterministically for testing."
                )
            ]

        return ExposureResult(
            is_exposed=len(incidents) > 0,
            incidents=incidents,
            provider_name="LeakLens Synthetic Demo Engine",
            mode="demo",
            source_notes="Deterministic synthetic record for college demonstration"
        )
