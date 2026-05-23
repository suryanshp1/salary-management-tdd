from sqlalchemy.orm import Session
from typing import List, Tuple, Optional, Dict, Any
from sqlalchemy import select, func, or_, desc, asc, text
from app.models.employee import Employee

class EmployeeRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_all(
        self,
        page: int = 1, 
        page_size: int = 20, 
    ) -> Tuple[List[Employee], int]:
        
        query = select(Employee).where(Employee.is_active == True)
            
        # Total count
        count_query = select(func.count()).select_from(query.subquery())
        total = self.session.execute(count_query).scalar() or 0

        # Pagination
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        items = list(self.session.execute(query).scalars().all())
        return items, total