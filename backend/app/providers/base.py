from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RawIncident(BaseModel):
    incident_name: str
    incident_year: Optional[int] = None
    incident_date: Optional[str] = None
    categories: List[str]
    severity: str = "MEDIUM"
    source_type: str = "Data Breach"
    description: str

class ExposureResult(BaseModel):
    is_exposed: bool
    incidents: List[RawIncident]
    provider_name: str
    mode: str = "demo"
    source_notes: Optional[str] = None

class ExposureProvider(ABC):
    @abstractmethod
    async def get_exposure(self, identifier: str, identifier_type: str) -> ExposureResult:
        """Fetch exposure records for a given email or username."""
        pass
