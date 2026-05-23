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
    ) -> Tuple[List[Employee], int]:
        return self.repository.get_all(page, page_size)