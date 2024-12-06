CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    username VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(60) NOT NULL UNIQUE,
    role ENUM('admin', 'user') DEFAULT 'user',
    premium TINYINT(1) NOT NULL DEFAULT 0,
    verification TINYINT(1) NOT NULL DEFAULT 0,
    token VARCHAR(255),
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, username, password, email, token)
    VALUES (
        'putra',
        'putraganteng',
        '$2b$12$XCgGoCbE.nLbux9akjaQDe03KxM9y4IqmeXcNKZUsdmaZX/40Vl.i',
        'putra@gmail.com',
        '0857'
    );

CREATE TABLE verification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    verification_code VARCHAR(4),
)
