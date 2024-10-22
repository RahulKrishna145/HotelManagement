const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

// Configure PostgreSQL connection
const pool = new Pool({
    user: 'postgres',         // replace with your PostgreSQL username
    host: 'localhost',
    database: 'hotelmanagement', // replace with your database name
    password: 'vaisakh1',     // replace with your PostgreSQL password
    port: 5432,               // default PostgreSQL port
});

// Create the billing_info view if it doesn't exist
pool.query(`
    CREATE OR REPLACE VIEW billing_info AS
    SELECT
        o.occupant_id,
        o.first_name,
        o.last_name,
        o.check_in_date,
        o.check_out_date,
        r.room_type
    FROM
        occupants o
    JOIN
        room r ON o.room_id = r.room_id;
`).catch(err => console.error('Error creating billing_info view:', err));

// Get all occupants
app.get('/api/occupants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM occupants');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching occupants:', err.message);
        res.status(500).send('Server error');
    }
});

// Get billing information by occupant ID
app.get('/api/billing/:id', async (req, res) => {
    const occupantId = req.params.id;
    console.log(`Fetching billing info for occupant ID: ${occupantId}`); // Log the occupant ID

    const query = `
        SELECT 
            first_name,
            last_name,
            check_in_date,
            check_out_date,
            room_type
        FROM 
            billing_info
        WHERE 
            occupant_id = $1;
    `;

    try {
        const { rows } = await pool.query(query, [occupantId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Occupant not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM employee');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching employees:', err.message);
        res.status(500).send('Server error');
    }
});

// Get all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM room');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching rooms:', err.message);
        res.status(500).send('Server error');
    }
});

// Get room details by room ID
app.get('/api/rooms/:id', async (req, res) => {
    const roomId = req.params.id;
    try {
        const result = await pool.query(
            'SELECT * FROM room WHERE room_id = $1',
            [roomId]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('Room not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching room:', err.message);
        res.status(500).send('Server error');
    }
});

// Add a new occupant
app.post('/api/occupants', async (req, res) => {
    const { first_name, last_name, room_id, check_in_date, check_out_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO occupants (first_name, last_name, room_id, check_in_date, check_out_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, room_id, check_in_date, check_out_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding occupant:', err.message);
        res.status(500).send('Server error');
    }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
    const { first_name, last_name, email, phone_number, role, base_salary } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO employee (first_name, last_name, email, phone_number, role, base_salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [first_name, last_name, email, phone_number, role, base_salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding employee:', err.message);
        res.status(500).send('Server error');
    }
});

// Add a new room
app.post('/api/rooms', async (req, res) => {
    const { room_number, room_type, status, price } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO room (room_number, room_type, status, price) VALUES ($1, $2, $3, $4) RETURNING *',
            [room_number, room_type, status, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding room:', err.message);
        res.status(500).send('Server error');
    }
});

// Update room status (Vacant or Occupied)
app.put('/api/rooms/:id', async (req, res) => {
    const { status } = req.body;
    const roomId = req.params.id;
    try {
        const result = await pool.query(
            'UPDATE room SET status = $1 WHERE room_id = $2 RETURNING *',
            [status, roomId]
        );
        if (result.rows.length === 0) {
            return res.status(404).send('Room not found');
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating room status:', err.message);
        res.status(500).send('Server error');
    }
});

// Add a payment record
app.post('/api/payments', async (req, res) => {
    const { occupant_id, amount, payment_date, payment_status } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO payment (occupant_id, amount, payment_date, payment_status) VALUES ($1, $2, $3, $4) RETURNING *',
            [occupant_id, amount, payment_date, payment_status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding payment:', err.message);
        res.status(500).send('Server error');
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM login_credentials WHERE username = $1 AND password = $2';
    const values = [username, password];

    try {
        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(401).send('Invalid username or password');
        }
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
