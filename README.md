read the file_structure.txt file first

1. Download postgres
2. download pgAdmin and make your database for eg: (hotelManagement).
3. create the schemas as follows:
CREATE TABLE Login_Credentials (
    Username VARCHAR(100) PRIMARY KEY,
    Password VARCHAR(100),
    Employee_id INT,
    FOREIGN KEY (Employee_id) REFERENCES Employee(Employee_ID)
);

CREATE TABLE Room (
    Room_id INT PRIMARY KEY,
    Room_type VARCHAR(50),
    Floor_number INT,
    Status VARCHAR(20),
    Check_in_date DATE,
    Check_out_date DATE
);

CREATE TABLE Occupants (
    Occupant_id INT PRIMARY KEY,
    First_name VARCHAR(100),
    Last_name VARCHAR(100),
    Room_id INT,
    Check_in_date DATE,
    Check_out_date DATE,
    FOREIGN KEY (Room_id) REFERENCES Room(Room_id)
);

CREATE TABLE Payment (
    Payment_id INT PRIMARY KEY,
    Occupant_id INT,
    Amount DECIMAL(10, 2),
    Payment_date DATE,
    Payment_status VARCHAR(20),
    FOREIGN KEY (Occupant_id) REFERENCES Occupants(Occupant_id)
);

CREATE TABLE Parking (
    Slot_number INT PRIMARY KEY,
    Occupant_id INT,
    Vehicle_number VARCHAR(50),
    FOREIGN KEY (Occupant_id) REFERENCES Occupants(Occupant_id)
);CREATE TABLE Employee (
    Employee_ID INT PRIMARY KEY,
    First_name VARCHAR(100),
    Last_name VARCHAR(100),
    Email VARCHAR(100),
    Phone_number VARCHAR(20),
    Role VARCHAR(50),
    Base_salary INT
); 

4. Insert some Sample records into the tables.
5. the 'server' code server.js runs the backend. insert your db username and password into the program, and your dbname to run the backend.
