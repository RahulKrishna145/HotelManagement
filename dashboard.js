document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('occupantsBtn').addEventListener('click', () => {
        window.location.href = 'occupants.html';
    });

    document.getElementById('employeesBtn').addEventListener('click', () => {
        window.location.href = 'employees.html';
    });

    document.getElementById('roomsBtn').addEventListener('click', () => {
        window.location.href = 'rooms.html';
    });
});
