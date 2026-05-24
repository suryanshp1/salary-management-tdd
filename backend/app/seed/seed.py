import os
import random
import time
import uuid
from decimal import Decimal
from datetime import datetime, timedelta

from sqlalchemy import insert
from app.database import SessionLocal, engine, Base
from app.models.employee import Employee

DEPARTMENTS = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"]
COUNTRIES = ["US", "UK", "India", "Germany", "Canada", "Australia", "Japan", "France", "Brazil", "Singapore", "Netherlands", "Sweden", "UAE", "Ireland", "South Korea"]
EMPLOYMENT_TYPES = ["full_time", "part_time", "contract"]

JOB_TITLES = {
    "Engineering": ["Software Engineer", "Senior Software Engineer", "DevOps Engineer", "QA Engineer", "Engineering Manager"],
    "Product": ["Product Manager", "Senior Product Manager", "VP of Product"],
    "Design": ["UX Designer", "UI Designer", "Product Designer", "Design Lead"],
    "Marketing": ["Marketing Specialist", "Content Strategist", "SEO Manager", "Marketing Director"],
    "Sales": ["Sales Representative", "Account Executive", "Sales Manager", "VP of Sales"],
    "HR": ["HR Coordinator", "Talent Acquisition Specialist", "HR Manager", "CHRO"],
    "Finance": ["Financial Analyst", "Accountant", "Finance Manager", "CFO"],
    "Operations": ["Operations Analyst", "Operations Manager", "COO"]
}

# Base salary ranges (in USD equivalent) by country to make it realistic
COUNTRY_MULTIPLIERS = {
    "US": 1.0, "UK": 0.8, "India": 0.3, "Germany": 0.85, "Canada": 0.75,
    "Australia": 0.85, "Japan": 0.7, "France": 0.75, "Brazil": 0.35,
    "Singapore": 0.9, "Netherlands": 0.8, "Sweden": 0.8, "UAE": 0.95,
    "Ireland": 0.85, "South Korea": 0.65
}

BASE_SALARIES = {
    "Engineering": 100000,
    "Product": 110000,
    "Design": 90000,
    "Marketing": 80000,
    "Sales": 75000,
    "HR": 70000,
    "Finance": 95000,
    "Operations": 85000
}

def load_names():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        with open(os.path.join(base_dir, "first_names.txt"), "r") as f:
            first_names = [line.strip() for line in f.readlines() if line.strip()]
    except FileNotFoundError:
        first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "Diana"]
        
    try:
        with open(os.path.join(base_dir, "last_names.txt"), "r") as f:
            last_names = [line.strip() for line in f.readlines() if line.strip()]
    except FileNotFoundError:
        last_names = ["Doe", "Smith", "Johnson", "Williams", "Brown", "Davis"]
        
    return first_names, last_names

def generate_employee_batch(batch_size: int, start_idx: int, first_names, last_names) -> list:
    batch = []
    
    for i in range(batch_size):
        idx = start_idx + i + 1
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        email = f"{first_name.lower()}.{last_name.lower()}{idx}@company.com"
        
        department = random.choice(DEPARTMENTS)
        job_title = random.choice(JOB_TITLES[department])
        country = random.choices(COUNTRIES, weights=[15, 10, 20, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5])[0]
        emp_type = random.choices(EMPLOYMENT_TYPES, weights=[80, 5, 15])[0]
        
        # Calculate realistic salary
        base_salary = BASE_SALARIES[department]
        
        # Adjust by job title seniority
        if "Senior" in job_title or "Lead" in job_title or "Manager" in job_title:
            base_salary *= random.uniform(1.3, 1.6)
        elif "VP" in job_title or "CFO" in job_title or "CHRO" in job_title or "COO" in job_title:
            base_salary *= random.uniform(2.0, 3.0)
            
        # Adjust by country
        base_salary *= COUNTRY_MULTIPLIERS[country]
        
        # Add random variation +/- 15%
        salary = base_salary * random.uniform(0.85, 1.15)
        
        hire_date = datetime.now() - timedelta(days=random.randint(1, 365 * 5))
        
        employee = {
            "id": uuid.uuid4(),
            "employee_id": f"EMP-{idx:05d}",
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "job_title": job_title,
            "department": department,
            "country": country,
            "city": f"{country} City",
            "salary": round(Decimal(salary), 2),
            "currency": "USD",
            "employment_type": emp_type,
            "hire_date": hire_date.date(),
            "is_active": True,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        batch.append(employee)
        
    return batch

def seed_database():
    TOTAL_EMPLOYEES = 10000
    BATCH_SIZE = 2000
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Loading names...")
    first_names, last_names = load_names()
    
    db = SessionLocal()
    try:
        # Check if already seeded
        count = db.query(Employee).count()
        if count >= TOTAL_EMPLOYEES:
            print(f"Database already seeded with {count} employees.")
            return

        print(f"Seeding {TOTAL_EMPLOYEES} employees...")
        start_time = time.perf_counter()
        
        for offset in range(0, TOTAL_EMPLOYEES, BATCH_SIZE):
            batch_size = min(BATCH_SIZE, TOTAL_EMPLOYEES - offset)
            batch = generate_employee_batch(batch_size, offset, first_names, last_names)
            
            db.execute(insert(Employee), batch)
            print(f"Inserted {offset + batch_size}/{TOTAL_EMPLOYEES}")
            
        db.commit()
        
        elapsed = time.perf_counter() - start_time
        print(f"Successfully seeded {TOTAL_EMPLOYEES} employees in {elapsed:.2f} seconds.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
