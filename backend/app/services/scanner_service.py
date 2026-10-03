from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

from app.config import settings
from app.models.database import Scan, RiskAssessment, ExposureIncident, Recommendation
from app.providers.base import ExposureProvider, RawIncident
from app.providers.demo_provider import DemoExposureProvider
from app.providers.external_provider import ExternalExposureProvider
from app.services.masking import hash_identifier, mask_identifier, validate_email_format, validate_username_format
from app.services.risk_engine import RiskEngine
from app.services.recommendation_engine import RecommendationEngine
from app.schemas.scan import ScanResponse, RiskFactor, IncidentSchema, RecommendationSchema, HistoryItemSchema, DashboardStatsSchema

class ScannerService:
    def __init__(self):
        # Instantiate provider based on config
        if settings.DATA_SOURCE_MODE.lower() == "external":
            self.provider: ExposureProvider = ExternalExposureProvider()
        else:
            self.provider = DemoExposureProvider()

    async def execute_scan(self, identifier: str, id_type: str, db: Session) -> ScanResponse:
        cleaned_id = identifier.strip()
        normalized_type = id_type.strip().lower()

        # Input validation
        if normalized_type == "email":
            if not validate_email_format(cleaned_id):
                raise ValueError("Please enter a valid email address format (e.g. user@example.com).")
        elif normalized_type == "username":
            if not validate_username_format(cleaned_id):
                raise ValueError("Username must be between 3 and 50 alphanumeric characters (allowing _, -, .).")

        # 1. Masking & Hashing
        masked_id = mask_identifier(cleaned_id, normalized_type)
        id_hash = hash_identifier(cleaned_id)

        # 2. Query Provider (Demo or External)
        exposure_result = await self.provider.get_exposure(cleaned_id, normalized_type)

        # 3. Compute Risk Assessment
        risk_result = RiskEngine.calculate_risk(exposure_result.incidents)

        # 4. Generate Priority Recommendations
        recommendations = RecommendationEngine.generate_recommendations(
            incidents=exposure_result.incidents,
            categories=risk_result["categories"],
            risk_level=risk_result["risk_level"]
        )

        # Determine status label
        if exposure_result.is_exposed and len(exposure_result.incidents) > 0:
            status = "potential_exposure"
            status_label = "Potential Exposure Detected"
        else:
            status = "no_exposure_found"
            status_label = "No known exposure found in configured sources"

        # 5. Persist in Database
        now_utc = datetime.now(timezone.utc)
        scan_record = Scan(
            identifier_hash=id_hash,
            masked_identifier=masked_id,
            identifier_type=normalized_type,
            status=status,
            mode=exposure_result.mode,
            created_at=now_utc
        )
        db.add(scan_record)
        db.flush()  # get scan_record.id

        # Save Risk Assessment
        risk_record = RiskAssessment(
            scan_id=scan_record.id,
            score=risk_result["score"],
            risk_level=risk_result["risk_level"],
            summary=risk_result["summary"],
            factors_json=risk_result["factors"],
            created_at=now_utc
        )
        db.add(risk_record)

        # Save Incidents
        incident_schemas: List[IncidentSchema] = []
        for inc in exposure_result.incidents:
            inc_db = ExposureIncident(
                scan_id=scan_record.id,
                incident_name=inc.incident_name,
                incident_year=inc.incident_year,
                incident_date=inc.incident_date,
                categories=inc.categories,
                severity=inc.severity,
                source_type=inc.source_type,
                description=inc.description,
                created_at=now_utc
            )
            db.add(inc_db)
            incident_schemas.append(IncidentSchema(
                incident_name=inc.incident_name,
                incident_year=inc.incident_year,
                incident_date=inc.incident_date,
                categories=inc.categories,
                severity=inc.severity,
                source_type=inc.source_type,
                description=inc.description
            ))

        # Save Recommendations
        rec_schemas: List[RecommendationSchema] = []
        for rec in recommendations:
            rec_db = Recommendation(
                scan_id=scan_record.id,
                priority=rec["priority"],
                title=rec["title"],
                description=rec["description"],
                action_category=rec["action_category"],
                completed=rec.get("completed", False),
                created_at=now_utc
            )
            db.add(rec_db)
            rec_schemas.append(RecommendationSchema(
                priority=rec["priority"],
                title=rec["title"],
                description=rec["description"],
                action_category=rec["action_category"],
                completed=rec.get("completed", False)
            ))

        db.commit()

        # Build Response
        return ScanResponse(
            scan_id=scan_record.id,
            identifier_hash=id_hash,
            masked_identifier=masked_id,
            identifier_type=normalized_type,
            status=status,
            status_label=status_label,
            mode=exposure_result.mode,
            risk_score=risk_result["score"],
            raw_score=risk_result.get("raw_score", risk_result["score"]),
            is_capped=risk_result.get("is_capped", False),
            risk_level=risk_result["risk_level"],
            risk_summary=risk_result["summary"],
            risk_factors=[RiskFactor(**f) for f in risk_result["factors"]],
            incidents=incident_schemas,
            categories_summary=risk_result["categories"],
            recommendations=rec_schemas,
            created_at=scan_record.created_at
        )

    def get_scan_by_id(self, scan_id: str, db: Session) -> Optional[ScanResponse]:
        scan_record = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan_record:
            return None

        risk = scan_record.risk_assessment
        incidents = scan_record.incidents
        recs = scan_record.recommendations

        incident_schemas = [
            IncidentSchema(
                id=inc.id,
                incident_name=inc.incident_name,
                incident_year=inc.incident_year,
                incident_date=inc.incident_date,
                categories=inc.categories if isinstance(inc.categories, list) else [],
                severity=inc.severity,
                source_type=inc.source_type,
                description=inc.description
            )
            for inc in incidents
        ]

        rec_schemas = [
            RecommendationSchema(
                id=r.id,
                priority=r.priority,
                title=r.title,
                description=r.description,
                action_category=r.action_category,
                completed=r.completed
            )
            for r in recs
        ]

        factors = [RiskFactor(**f) for f in (risk.factors_json or [])] if risk else []
        all_categories = set()
        for inc in incident_schemas:
            for cat in inc.categories:
                all_categories.add(cat)

        status_label = (
            "Potential Exposure Detected" 
            if scan_record.status == "potential_exposure" 
            else "No known exposure found in configured sources"
        )

        return ScanResponse(
            scan_id=scan_record.id,
            identifier_hash=scan_record.identifier_hash,
            masked_identifier=scan_record.masked_identifier,
            identifier_type=scan_record.identifier_type,
            status=scan_record.status,
            status_label=status_label,
            mode=scan_record.mode,
            risk_score=risk.score if risk else 0,
            risk_level=risk.risk_level if risk else "LOW",
            risk_summary=risk.summary if risk else "No summary available",
            risk_factors=factors,
            incidents=incident_schemas,
            categories_summary=sorted(list(all_categories)),
            recommendations=rec_schemas,
            created_at=scan_record.created_at
        )

    def get_scan_history(self, db: Session, limit: int = 50) -> List[HistoryItemSchema]:
        scans = db.query(Scan).order_by(desc(Scan.created_at)).limit(limit).all()
        history: List[HistoryItemSchema] = []
        for s in scans:
            score = s.risk_assessment.score if s.risk_assessment else 0
            risk_level = s.risk_assessment.risk_level if s.risk_assessment else "LOW"
            history.append(HistoryItemSchema(
                scan_id=s.id,
                identifier_hash=s.identifier_hash,
                masked_identifier=s.masked_identifier,
                identifier_type=s.identifier_type,
                status=s.status,
                risk_score=score,
                risk_level=risk_level,
                incident_count=len(s.incidents),
                mode=s.mode,
                created_at=s.created_at
            ))
        return history

    def clear_scan_history(self, db: Session) -> int:
        count = db.query(Scan).count()
        db.query(Scan).delete()
        db.commit()
        return count

    def get_dashboard_metrics(self, db: Session) -> DashboardStatsSchema:
        total_scans = db.query(Scan).count()
        if total_scans == 0:
            return DashboardStatsSchema(
                total_scans=0,
                scans_with_exposure=0,
                clean_scans=0,
                average_risk_score=0.0,
                risk_level_distribution={"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0},
                top_exposed_categories=[],
                recent_activity=[]
            )

        scans_with_exposure = db.query(Scan).filter(Scan.status == "potential_exposure").count()
        clean_scans = total_scans - scans_with_exposure

        # Average risk score
        avg_score_res = db.query(func.avg(RiskAssessment.score)).scalar()
        avg_score = round(float(avg_score_res), 1) if avg_score_res is not None else 0.0

        # Distribution
        risk_dist = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
        assessments = db.query(RiskAssessment.risk_level, func.count(RiskAssessment.id)).group_by(RiskAssessment.risk_level).all()
        for level, count in assessments:
            if level in risk_dist:
                risk_dist[level] = count

        # Top categories
        category_counts: Dict[str, int] = {}
        incidents = db.query(ExposureIncident).all()
        for inc in incidents:
            if isinstance(inc.categories, list):
                for cat in inc.categories:
                    category_counts[cat] = category_counts.get(cat, 0) + 1

        top_categories = [
            {"category": k, "count": v}
            for k, v in sorted(category_counts.items(), key=lambda item: item[1], reverse=True)[:6]
        ]

        recent = self.get_scan_history(db, limit=5)

        return DashboardStatsSchema(
            total_scans=total_scans,
            scans_with_exposure=scans_with_exposure,
            clean_scans=clean_scans,
            average_risk_score=avg_score,
            risk_level_distribution=risk_dist,
            top_exposed_categories=top_categories,
            recent_activity=recent
        )
