
document.addEventListener('DOMContentLoaded', () => {
    const addEmployeeForm = document.getElementById('addEmployeeForm');

    addEmployeeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const firstName = document.getElementById('employeeFirstName').value;
        const lastName = document.getElementById('employeeLastName').value;
        const email = document.getElementById('email').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const role = 'manager';
        const baseSalary = 8000;
    
        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name: firstName, last_name: lastName, email, phone_number: phoneNumber, role, base_salary: baseSalary }),
            });
    
            if (response.ok) {
                alert('Employee added successfully!');
                loadEmployees(); // Refresh the list of employees
                addEmployeeForm.reset(); // Clear the form
            } else {
                const errorData = await response.json();
                console.error('Error details:', errorData);
                alert('Failed to add employee: ' + (errorData.message || 'Unknown error.'));
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
