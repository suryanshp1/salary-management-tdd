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