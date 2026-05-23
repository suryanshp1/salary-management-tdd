from app.repositories.employee import EmployeeRepository

class EmployeeService:
    def __init__(self, repository: EmployeeRepository):
        self.repository = repository