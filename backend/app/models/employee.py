import uuid
from sqlalchemy import Column, String, Numeric, Boolean, Date, DateTime, func, Index, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employee_id = Column(String(10), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    job_title = Column(String(150), nullable=False, index=True)
    department = Column(String(100), nullable=False, index=True)
    country = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=True)
    salary = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), nullable=False, default="USD")
    employment_type = Column(String(20), nullable=False)
    hire_date = Column(Date, nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint('salary > 0', name='check_salary_positive'),
        Index('idx_employee_country_job', 'country', 'job_title'),
    )

    def __repr__(self):
        return f"<Employee(id={self.id}, employee_id='{self.employee_id}', email='{self.email}')>"
