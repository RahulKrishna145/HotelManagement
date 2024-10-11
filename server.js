const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure your PostgreSQL connection
const pool = new Pool({
    user: 'postgres',    // replace with your PostgreSQL username
    host: 'localhost',
    database: 'hotelManagement', // replace with your database name
    password: 'J@egar145',  // replace with your PostgreSQL password
    port: 5432,                 // default PostgreSQL port
});

// Get all occupants
app.get('/api/occupants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Occupants');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching occupants:', err.message);
        res.status(500).send('Server error');
    }
});

// Get all employees
app.get('/api/employees', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Employee');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching employees:', err.message);
        res.status(500).send('Server error');
    }
});

// Get all rooms
app.get('/api/rooms', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Room');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching rooms:', err.message);
        res.status(500).send('Server error');
    }
});

// Add a new occupant
app.post('/api/occupants', async (req, res) => {
    const { first_name, last_name, room_id, check_in_date, check_out_date } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Occupants (First_name, Last_name, Room_id, Check_in_date, Check_out_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
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
            'INSERT INTO Employee (First_name, Last_name, Email, Phone_number, Role, Base_salary) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [first_name, last_name, email, phone_number, role, base_salary]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding employee:', err.message);
        res.status(500).send('Server error');
    }
});

// Update room status (Vacant or Occupied)
app.put('/api/rooms/:id', async (req, res) => {
    const { status } = req.body;
    const roomId = req.params.id;
    try {
        const result = await pool.query(
            'UPDATE Room SET Status = $1 WHERE Room_id = $2 RETURNING *',
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});