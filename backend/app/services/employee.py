from app.repositories.employee import EmployeeRepository
from typing import List, Tuple, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate
import re

class EmployeeService:
    def __init__(self, repository: EmployeeRepository):
        self.repository = repository
    
    def list_employees(
        self, 
        page: int = 1, 
        page_size: int = 20, 
        search: Optional[str] = None,
        country: Optional[str] = None,
        department: Optional[str] = None,
        job_title: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc"
    ) -> Tuple[List[Employee], int]:
        return self.repository.get_all(
            page, page_size, search, country, department, job_title, sort_by, sort_order
        )

    def create_employee(self, data: EmployeeCreate) -> Employee:
        # Generate email
        base_email = f"{data.first_name.lower()}.{data.last_name.lower()}@company.com"
        # Clean email
        base_email = re.sub(r'[^a-z0-9.@]', '', base_email)
        
        email = base_email
        counter = 1
        while self.repository.get_by_email(email):
            email = base_email.replace("@company.com", f"{counter}@company.com")
            counter += 1
            
        employee_id = self.repository.get_next_employee_id()
        
        employee_data = data.model_dump()
        employee_data["email"] = email
        employee_data["employee_id"] = employee_id
        
        employee = Employee(**employee_data)
        
        try:
            return self.repository.create(employee)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))