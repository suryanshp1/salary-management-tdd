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