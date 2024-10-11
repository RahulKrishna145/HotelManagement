document.addEventListener('DOMContentLoaded', () => {
    const addEmployeeForm = document.getElementById('addEmployeeForm');

    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('employeeFirstName').value;
        const lastName = document.getElementById('employeeLastName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const role = document.getElementById('role').value;
        const baseSalary = document.getElementById('baseSalary').value;

        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email, phoneNumber, role, baseSalary }),
            });

            if (response.ok) {
                alert('Employee added successfully!');
                loadEmployees(); // Refresh the list of employees
                addEmployeeForm.reset(); // Clear the form
            } else {
                alert('Failed to add employee.');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    async function loadEmployees() {
        try {
            const response = await fetch('http://localhost:5000/api/employees');
            const employees = await response.json();

            const employeesList = document.getElementById('employeesList');
            employeesList.innerHTML = employees.map(employee => `
                <div class="employee-record">
                    <span>${employee.first_name}</span>
                    <span>${employee.last_name}</span>
                    <span>${employee.email}</span>
                    <span>${employee.phone_number}</span>
                    <span>${employee.role}</span>
                    <span>${employee.base_salary}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    }

    // Initial fetch of employees
    loadEmployees();
});