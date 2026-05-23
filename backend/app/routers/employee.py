from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.repositories.employee import EmployeeRepository
from app.services.employee import EmployeeService
from app.schemas.employee import EmployeePaginatedResponse, EmployeeResponse, EmployeeCreate
from app.database import get_db
from typing import Optional
import math

router = APIRouter(prefix="/employees", tags=["employees"])

def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    repo = EmployeeRepository(db)
    return EmployeeService(repo)

@router.get("", response_model=EmployeePaginatedResponse)
def list_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    country: Optional[str] = None,
    department: Optional[str] = None,
    job_title: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: str = Query("asc", pattern="^(asc|desc)$"),
    service: EmployeeService = Depends(get_employee_service)
):
    items, total = service.list_employees(
        page, page_size, search, country, department, job_title, sort_by, sort_order
    )
    total_pages = math.ceil(total / page_size) if total > 0 else 0
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }

@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    data: EmployeeCreate,
    service: EmployeeService = Depends(get_employee_service),
    db: Session = Depends(get_db)
):
    employee = service.create_employee(data)
    db.commit()
    db.refresh(employee)
    return employee