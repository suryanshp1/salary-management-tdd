# --- GET /api/v1/employees Tests ---
def test_list_employees(client, sample_employee):
    response = client.get("/api/v1/employees")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["email"] == sample_employee.email