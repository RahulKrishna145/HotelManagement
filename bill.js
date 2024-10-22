document.addEventListener('DOMContentLoaded', () => {
    const billForm = document.getElementById('billForm');

    billForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const occupantId = document.getElementById('occupantId').value;

        try {
            // Fetch occupant details
            const occupantResponse = await fetch(`http://localhost:5000/api/occupants/${occupantId}`);
            if (!occupantResponse.ok) {
                throw new Error('Occupant not found');
            }
            const occupant = await occupantResponse.json();
            console.log('Occupant data:', occupant); // Log the full occupant data

            // Validate each required field
            if (!occupant.check_in_date || !occupant.check_out_date || !occupant.room_type) {
                console.error('Check-in date:', occupant.check_in_date);
                console.error('Check-out date:', occupant.check_out_date);
                console.error('Room type:', occupant.room_type); // This should now log the correct room type
                throw new Error('Missing required occupant details');
            }

            // Get check-in and check-out dates
            const checkInDate = new Date(occupant.check_in_date);
            const checkOutDate = new Date(occupant.check_out_date);
            const daysOfOccupancy = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

            // Room type costs
            const roomCosts = {
                single: 3000,
                double: 6000,
                suite: 10000
            };

            // Determine cost per day based on room type
            const roomType = occupant.room_type.toLowerCase(); // Make sure this is correct
            const costPerDay = roomCosts[roomType];

            if (costPerDay === undefined) {
                throw new Error('Invalid room type');
            }

            // Calculate total cost and tax
            const totalCost = daysOfOccupancy * costPerDay;
            const taxRate = 0.12; // 12% tax
            const taxAmount = totalCost * taxRate;
            const totalAmount = totalCost + taxAmount;

            // Display bill details
            document.getElementById('occupantName').textContent = `${occupant.first_name} ${occupant.last_name}`;
            document.getElementById('roomType').textContent = roomType;
            document.getElementById('roomCost').textContent = totalCost.toFixed(2);
            document.getElementById('taxAmount').textContent = taxAmount.toFixed(2);
            document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);

            // Show the bill output
            document.getElementById('billOutput').style.display = 'block';

        } catch (error) {
            console.error('Error generating bill:', error.message || error);
            alert(`An error occurred: ${error.message || 'Please try again later.'}`);
        }
    });
});
