document.addEventListener('DOMContentLoaded', () => {
    async function loadRooms() {
        try {
            const response = await fetch('http://localhost:5000/api/rooms');
            const rooms = await response.json();

            const roomsList = document.getElementById('roomsList');
            roomsList.innerHTML = rooms.map(room => `
                <div class="room-record">
                    <span>Room ID: ${room.room_id}</span>
                    <span>Type: ${room.room_type}</span>
                    <span>Floor: ${room.floor_number}</span>
                    <span>Status: ${room.status}</span>
                    <span>Check-in Date: ${room.check_in_date}</span>
                    <span>Check-out Date: ${room.check_out_date}</span>
                    <button onclick="changeRoomStatus(${room.room_id}, '${room.status}')">
                        Mark as ${room.status === 'occupied' ? 'vacant' : 'occupied'}
                    </button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    }

    async function changeRoomStatus(roomId, currentStatus) {
        const newStatus = currentStatus === 'occupied' ? 'vacant' : 'occupied';
        try {
            const response = await fetch(`http://localhost:5000/api/rooms/${roomId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (response.ok) {
                alert(`Room status changed to ${newStatus}`);
                loadRooms(); // Reload rooms
            } else {
                alert('Failed to change room status.');
            }
        } catch (error) {
            console.error('Error changing room status:', error);
            alert('An error occurred. Please try again later.');
        }
    }

    // Initial fetch of rooms
    loadRooms();
});