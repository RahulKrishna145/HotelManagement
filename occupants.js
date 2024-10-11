document.addEventListener('DOMContentLoaded', () => {
    const occupantForm = document.getElementById('occupantForm');
    const occupantsList = document.getElementById('occupantsList');

    // Fetch and display occupants
    const fetchOccupants = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/occupants');
            const occupants = await response.json();
            occupantsList.innerHTML = occupants.map(occupant => `
                <div class="occupant-record">
                    <span>${occupant.first_name}</span>
                    <span>${occupant.last_name}</span>
                    <span>${occupant.room_id}</span>
                    <span>${occupant.check_in_date}</span>
                    <span>${occupant.check_out_date}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching occupants:', error);
        }
    };

    // Add new occupant
    occupantForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const room_id = document.getElementById('room_id').value;
        const check_in_date = document.getElementById('check_in_date').value;
        const check_out_date = document.getElementById('check_out_date').value;

        try {
            const response = await fetch('http://localhost:5000/api/occupants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ first_name, last_name, room_id, check_in_date, check_out_date }),
            });

            if (response.ok) {
                fetchOccupants(); // Refresh the list of occupants
                occupantForm.reset(); // Clear the form
            } else {
                console.error('Error adding occupant:', await response.json());
            }
        } catch (error) {
            console.error('Error adding occupant:', error);
        }
    });

    // Initial fetch of occupants
    fetchOccupants();
});