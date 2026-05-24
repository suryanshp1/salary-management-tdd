from app.repositories.employee import EmployeeRepository
from typing import List, Tuple, Optional, Dict, Any
from uuid import UUID
from fastapi import HTTPException
from app.models.employee import Employee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate
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

    def get_employee(self, id: UUID) -> Employee:
        employee = self.repository.get_by_id(id)
        if not employee:
            raise HTTPException(status_code=404, detail="Employee not found")
        return employee

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

    def update_employee(self, id: UUID, data: EmployeeUpdate) -> Employee:
        employee = self.get_employee(id)
        update_data = data.model_dump(exclude_unset=True)
        
        if not update_data:
            return employee
            
        try:
            return self.repository.update(employee, update_data)
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))
    
    def delete_employee(self, id: UUID) -> None:
        employee = self.get_employee(id)
        self.repository.soft_delete(employee)

    # Insights delegates
    def get_salary_by_country(self) -> List[Dict[str, Any]]:
        return self.repository.get_salary_by_country()
        
    def get_salary_by_job_title(self, country: Optional[str] = None) -> List[Dict[str, Any]]:
        return self.repository.get_salary_by_job_title(country)
        
    def get_department_distribution(self) -> List[Dict[str, Any]]:
        return self.repository.get_department_distribution()
        
    def get_country_distribution(self) -> List[Dict[str, Any]]:
        return self.repository.get_country_distribution()
        
    def get_salary_ranges(self) -> List[Dict[str, Any]]:
        return self.repository.get_salary_ranges()
        
    def get_summary(self) -> Dict[str, Any]:
        return self.repository.get_summary()
        
    def get_top_earners(self, limit: int = 10) -> List[Employee]:
        return self.repository.get_top_earners(limit)
        
    def get_distinct_countries(self) -> List[str]:
        return self.repository.get_distinct_countries()
        
    def get_distinct_departments(self) -> List[str]:
        return self.repository.get_distinct_departments()
        
    def get_distinct_job_titles(self) -> List[str]:
        return self.repository.get_distinct_job_titles()