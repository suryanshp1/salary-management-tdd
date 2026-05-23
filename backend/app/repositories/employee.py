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
        search: Optional[str] = None, 
        country: Optional[str] = None,
        department: Optional[str] = None,
        job_title: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc"
    ) -> Tuple[List[Employee], int]:
        
        query = select(Employee).where(Employee.is_active == True)
        
        if search:
            search_term = f"%{search}%"
            query = query.where(
                or_(
                    Employee.first_name.ilike(search_term),
                    Employee.last_name.ilike(search_term),
                    Employee.email.ilike(search_term),
                    Employee.employee_id.ilike(search_term)
                )
            )
            
        if country:
            query = query.where(Employee.country == country)
        if department:
            query = query.where(Employee.department == department)
        if job_title:
            query = query.where(Employee.job_title == job_title)
            
        # Total count
        count_query = select(func.count()).select_from(query.subquery())
        total = self.session.execute(count_query).scalar() or 0
        
        # Sorting
        if sort_by and hasattr(Employee, sort_by):
            column = getattr(Employee, sort_by)
            if sort_order.lower() == "desc":
                query = query.order_by(desc(column))
            else:
                query = query.order_by(asc(column))
        else:
            query = query.order_by(desc(Employee.created_at))
            
        # Pagination
        query = query.offset((page - 1) * page_size).limit(page_size)
        
        items = list(self.session.execute(query).scalars().all())
        return items, total