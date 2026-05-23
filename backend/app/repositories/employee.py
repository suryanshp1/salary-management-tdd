from sqlalchemy.orm import Session

class EmployeeRepository:
    def __init__(self, session: Session):
        self.session = session