import httpx
from typing import List
from app.providers.base import ExposureProvider, ExposureResult, RawIncident
from app.config import settings

class ExternalExposureProvider(ExposureProvider):
    """
    Extensible API Provider for real/external exposure sources (e.g., HaveIBeenPwned API v3 or custom CTI feeds).
    Active only when DATA_SOURCE_MODE=external and credentials are configured via environment variables.
    """

    def __init__(self):
        self.base_url = settings.EXTERNAL_API_BASE_URL.rstrip("/")
        self.api_key = settings.EXTERNAL_API_KEY
        self.headers = {
            "User-Agent": "LeakLens-CyberSecurity-CollegeProject",
        }
        if self.api_key:
            self.headers["hibp-api-key"] = self.api_key

    async def get_exposure(self, identifier: str, identifier_type: str) -> ExposureResult:
        if not self.base_url:
            raise ValueError("EXTERNAL_API_BASE_URL is not configured in environment variables.")

        url = f"{self.base_url}/breachedaccount/{identifier}"
        params = {"truncateResponse": "false"}

        async with httpx.AsyncClient(timeout=10.0) as client:
            try:
                response = await client.get(url, headers=self.headers, params=params)
                
                if response.status_code == 404:
                    return ExposureResult(
                        is_exposed=False,
                        incidents=[],
                        provider_name="External Threat Intelligence Feed",
                        mode="external",
                        source_notes="No public breach records found in configured external feed."
                    )
                
                if response.status_code == 200:
                    data = response.json()
                    incidents: List[RawIncident] = []
                    for item in data:
                        # Normalize external schema safely
                        categories = item.get("DataClasses", ["Email", "Account Metadata"])
                        year = None
                        b_date = item.get("BreachDate")
                        if b_date and len(b_date) >= 4:
                            try:
                                year = int(b_date[:4])
                            except ValueError:
                                pass
                        
                        incidents.append(
                            RawIncident(
                                incident_name=item.get("Title") or item.get("Name", "Unnamed Breach"),
                                incident_year=year,
                                incident_date=b_date,
                                categories=categories,
                                severity="HIGH" if item.get("IsSensitive") or "Passwords" in categories else "MEDIUM",
                                source_type="External CTI Feed",
                                description=item.get("Description", "External recorded exposure incident.")
                            )
                        )
                    return ExposureResult(
                        is_exposed=len(incidents) > 0,
                        incidents=incidents,
                        provider_name="External Threat Intelligence Feed",
                        mode="external",
                        source_notes="Verified external breach archive data"
                    )
                
                if response.status_code == 401 or response.status_code == 403:
                    raise PermissionError("External provider rejected API credentials. Check EXTERNAL_API_KEY.")

                raise RuntimeError(f"External API returned unexpected HTTP status {response.status_code}")

            except httpx.RequestError as exc:
                raise ConnectionError(f"Network error connecting to external provider: {str(exc)}")
