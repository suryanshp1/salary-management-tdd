import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
import uuid
from decimal import Decimal
from datetime import date

from app.database import Base, get_db
from app.main import app
from app.models.employee import Employee

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(setup_database):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def sample_employee(db_session):
    emp = Employee(
        id=uuid.uuid4(),
        employee_id="EMP-00001",
        first_name="John",
        last_name="Doe",
        email="john.doe@company.com",
        job_title="Software Engineer",
        department="Engineering",
        country="US",
        city="New York",
        salary=Decimal("100000.00"),
        currency="USD",
        employment_type="full_time",
        hire_date=date(2023, 1, 1),
        is_active=True
    )
    db_session.add(emp)
    db_session.flush()
    return emp

@pytest.fixture
def elaborate_employees(db_session):
    employees = [
        Employee(
            id=uuid.uuid4(), employee_id="EMP-10001", first_name="John", last_name="Alpha", email="john.a@company.com",
            job_title="Software Engineer", department="Engineering", country="US", city="NY",
            salary=Decimal("100000.00"), currency="USD", employment_type="full_time", hire_date=date(2022, 1, 1), is_active=True
        ),
        Employee(
            id=uuid.uuid4(), employee_id="EMP-10002", first_name="Jane", last_name="Beta", email="jane.b@company.com",
            job_title="Staff Engineer", department="Engineering", country="US", city="SF",
            salary=Decimal("150000.00"), currency="USD", employment_type="full_time", hire_date=date(2021, 5, 1), is_active=True
        ),
        Employee(
            id=uuid.uuid4(), employee_id="EMP-10003", first_name="Bob", last_name="Gamma", email="bob.g@company.com",
            job_title="Account Executive", department="Sales", country="US", city="Austin",
            salary=Decimal("80000.00"), currency="USD", employment_type="full_time", hire_date=date(2023, 3, 1), is_active=True
        ),
        Employee(
            id=uuid.uuid4(), employee_id="EMP-10004", first_name="Alice", last_name="Delta", email="alice.d@company.com",
            job_title="Software Engineer", department="Engineering", country="UK", city="London",
            salary=Decimal("120000.00"), currency="GBP", employment_type="full_time", hire_date=date(2022, 8, 15), is_active=True
        ),
        Employee(
            id=uuid.uuid4(), employee_id="EMP-10005", first_name="Charlie", last_name="Epsilon", email="charlie.e@company.com",
            job_title="Sales Director", department="Sales", country="UK", city="London",
            salary=Decimal("90000.00"), currency="GBP", employment_type="full_time", hire_date=date(2020, 11, 1), is_active=True
        ),
    ]
    db_session.add_all(employees)
    db_session.flush()
    return employees
