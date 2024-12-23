CREATE TABLE verification (
    verif_id INT AUTO_INCREMENT PRIMARY KEY, 
    user_id INT NOT NULL,                   
    verif_code VARCHAR(255) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL 
);