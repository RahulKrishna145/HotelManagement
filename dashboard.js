document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('go-to-employees').addEventListener('click', () => {
        window.location.href = 'employees.html';
    });

    document.getElementById('go-to-occupants').addEventListener('click', () => {
        window.location.href = 'occupants.html';
    });

    document.getElementById('go-to-rooms').addEventListener('click', () => {
        window.location.href = 'rooms.html';
    });
});
