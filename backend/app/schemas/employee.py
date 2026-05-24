from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator
from typing import Optional, List
from datetime import date, datetime
from uuid import UUID
from decimal import Decimal

class EmployeeBase(BaseModel):
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    job_title: str = Field(..., min_length=1, max_length=150)
    department: str = Field(..., min_length=1, max_length=100)
    country: str = Field(..., min_length=1, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    salary: Decimal = Field(..., gt=0)
    currency: str = Field("USD", min_length=3, max_length=3)
    employment_type: str = Field(..., pattern="^(full_time|part_time|contract)$")
    hire_date: date
    is_active: bool = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    job_title: Optional[str] = Field(None, min_length=1, max_length=150)
    department: Optional[str] = Field(None, min_length=1, max_length=100)
    country: Optional[str] = Field(None, min_length=1, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    salary: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = Field(None, min_length=3, max_length=3)
    employment_type: Optional[str] = Field(None, pattern="^(full_time|part_time|contract)$")
    hire_date: Optional[date] = None
    is_active: Optional[bool] = None

class EmployeeResponse(EmployeeBase):
    id: UUID
    employee_id: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class EmployeePaginatedResponse(BaseModel):
    items: List[EmployeeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

# Analytics Schemas
class SalaryByCountry(BaseModel):
    country: str
    min_salary: Decimal
    max_salary: Decimal
    avg_salary: Decimal
    median_salary: Decimal
    employee_count: int

class SalaryByJobTitle(BaseModel):
    job_title: str
    avg_salary: Decimal
    employee_count: int

class DepartmentDistribution(BaseModel):
    department: str
    employee_count: int

class CountryDistribution(BaseModel):
    country: str
    employee_count: int

class SalaryRange(BaseModel):
    range_label: str
    count: int

class SalarySummary(BaseModel):
    total_employees: int
    avg_salary: Decimal
    total_payroll: Decimal
    active_countries: int
    active_departments: int

class TopEarner(BaseModel):
    id: UUID
    first_name: str
    last_name: str
    job_title: str
    department: str
    country: str
    salary: Decimal
