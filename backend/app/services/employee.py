from app.repositories.employee import EmployeeRepository
from typing import List, Tuple, Optional, Dict, Any
from app.models.employee import Employee

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