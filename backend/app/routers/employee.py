from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.repositories.employee import EmployeeRepository
from app.services.employee import EmployeeService
from app.schemas.employee import EmployeePaginatedResponse
from app.database import get_db
import math

router = APIRouter(prefix="/employees", tags=["employees"])

def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    repo = EmployeeRepository(db)
    return EmployeeService(repo)

@router.get("", response_model=EmployeePaginatedResponse)
def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    service: EmployeeService = Depends(get_employee_service)
):
    items, total = service.list_employees(page, page_size)
    total_pages = math.ceil(total / page_size) if total > 0 else 0

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }