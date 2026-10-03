from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.models.database import get_db
from app.schemas.scan import (
    ScanRequest, ScanResponse, HistoryItemSchema, DashboardStatsSchema
)
from app.services.scanner_service import ScannerService
from app.services.tips_data import SECURITY_TIPS_DATA
from app.config import settings

router = APIRouter(prefix="/api")
scanner_service = ScannerService()

@router.get("/health", summary="System Health & Status")
def get_health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "mode": settings.DATA_SOURCE_MODE,
        "privacy_notice": "LeakLens is a defensive cybersecurity tool. Passwords are never collected or stored."
    }

@router.post("/scan", response_model=ScanResponse, summary="Perform Personal Data Exposure Scan")
async def perform_scan(
    payload: ScanRequest,
    db: Session = Depends(get_db)
):
    try:
        response = await scanner_service.execute_scan(
            identifier=payload.identifier,
            id_type=payload.type,
            db=db
        )
        return response
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err)
        )
    except PermissionError as perm_err:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=str(perm_err)
        )
    except ConnectionError as conn_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Exposure provider service is temporarily unreachable. Please retry shortly."
        )
    except Exception as err:
        # Prevent leaking raw backend stack traces
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while evaluating exposure risk. Please try again."
        )

@router.get("/scan/{scan_id}", response_model=ScanResponse, summary="Retrieve Scan Report by ID")
def get_scan(
    scan_id: str,
    db: Session = Depends(get_db)
):
    report = scanner_service.get_scan_by_id(scan_id=scan_id, db=db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested exposure scan report was not found or has been cleared."
        )
    return report

@router.get("/history", response_model=List[HistoryItemSchema], summary="Retrieve Privacy-Preserved Scan History")
def get_history(
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return scanner_service.get_scan_history(db=db, limit=limit)

@router.delete("/history", summary="Clear Local Scan History")
def clear_history(
    db: Session = Depends(get_db)
):
    count = scanner_service.clear_scan_history(db=db)
    return {"message": f"Successfully cleared {count} scan records.", "deleted_count": count}

@router.get("/dashboard", response_model=DashboardStatsSchema, summary="Retrieve Aggregated Risk Dashboard Metrics")
def get_dashboard(
    db: Session = Depends(get_db)
):
    return scanner_service.get_dashboard_metrics(db=db)

@router.get("/security-tips", summary="Get Categorized Cybersecurity Guidelines")
def get_security_tips():
    return SECURITY_TIPS_DATA
