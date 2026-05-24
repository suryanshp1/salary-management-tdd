from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID

from app.database import get_db
from app.repositories.employee import EmployeeRepository
from app.services.employee import EmployeeService
from app.schemas.employee import (
    SalaryByCountry,
    SalaryByJobTitle,
    DepartmentDistribution,
    CountryDistribution,
    SalaryRange,
    SalarySummary,
    EmployeeResponse,
    TopEarner
)

router = APIRouter(prefix="/insights", tags=["insights"])
ref_router = APIRouter(prefix="/reference", tags=["reference"])

def get_employee_service(db: Session = Depends(get_db)) -> EmployeeService:
    repo = EmployeeRepository(db)
    return EmployeeService(repo)

@router.get("/salary-by-country", response_model=List[SalaryByCountry])
def salary_by_country(service: EmployeeService = Depends(get_employee_service)):
    return service.get_salary_by_country()

@router.get("/salary-by-job-title", response_model=List[SalaryByJobTitle])
def salary_by_job_title(
    country: Optional[str] = None,
    service: EmployeeService = Depends(get_employee_service)
):
    return service.get_salary_by_job_title(country)

@router.get("/department-distribution", response_model=List[DepartmentDistribution])
def department_distribution(service: EmployeeService = Depends(get_employee_service)):
    return service.get_department_distribution()

@router.get("/country-distribution", response_model=List[CountryDistribution])
def country_distribution(service: EmployeeService = Depends(get_employee_service)):
    return service.get_country_distribution()

@router.get("/salary-ranges", response_model=List[SalaryRange])
def salary_ranges(service: EmployeeService = Depends(get_employee_service)):
    return service.get_salary_ranges()

@router.get("/summary", response_model=SalarySummary)
def summary(service: EmployeeService = Depends(get_employee_service)):
    return service.get_summary()

@router.get("/top-earners", response_model=List[TopEarner])
def top_earners(
    limit: int = Query(10, ge=1, le=100),
    service: EmployeeService = Depends(get_employee_service)
):
    return service.get_top_earners(limit)


# Reference Routes
@ref_router.get("/countries", response_model=List[str])
def distinct_countries(service: EmployeeService = Depends(get_employee_service)):
    return service.get_distinct_countries()

@ref_router.get("/departments", response_model=List[str])
def distinct_departments(service: EmployeeService = Depends(get_employee_service)):
    return service.get_distinct_departments()

@ref_router.get("/job-titles", response_model=List[str])
def distinct_job_titles(service: EmployeeService = Depends(get_employee_service)):
    return service.get_distinct_job_titles()
