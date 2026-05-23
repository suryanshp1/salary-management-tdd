# --- GET /api/v1/employees Tests ---
def test_list_employees(client, sample_employee):
    response = client.get("/api/v1/employees")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["email"] == sample_employee.email

def test_list_employees_pagination(client, elaborate_employees):
    # elaborate_employees has 5 items.
    response = client.get("/api/v1/employees?page=2&page_size=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["total"] == 5
    assert data["total_pages"] == 3

def test_list_employees_complex_filtering(client, elaborate_employees):
    # Filter by country=US and department=Engineering -> Alpha and Beta
    response = client.get("/api/v1/employees?country=US&department=Engineering")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    for emp in data["items"]:
        assert emp["country"] == "US"
        assert emp["department"] == "Engineering"

def test_list_employees_sorting_logic(client, elaborate_employees):
    # Sort by salary DESC. Beta(150k), Delta(120k), Alpha(100k), Epsilon(90k), Gamma(80k)
    response = client.get("/api/v1/employees?sort_by=salary&sort_order=desc")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 5
    assert float(data["items"][0]["salary"]) == 150000.0
    assert float(data["items"][1]["salary"]) == 120000.0
    assert float(data["items"][-1]["salary"]) == 80000.0

def test_list_employees_case_insensitive_search(client, elaborate_employees):
    # Search for "aLpHA" should match "Alpha"
    response = client.get("/api/v1/employees?search=aLpHA")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["last_name"] == "Alpha"

# --- POST /api/v1/employees Tests ---

def test_create_employee(client):
    payload = {
        "first_name": "Jane",
        "last_name": "Smith",
        "job_title": "Product Manager",
        "department": "Product",
        "country": "UK",
        "salary": 120000,
        "currency": "USD",
        "employment_type": "full_time",
        "hire_date": "2023-05-01",
    }
    response = client.post("/api/v1/employees", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "jane.smith@company.com"
    assert "id" in data
    assert "employee_id" in data