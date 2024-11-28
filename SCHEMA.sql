CREATE TABLE users (
    id integer PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
    username VARCHAR(30),
    password VARCHAR(30),
    email VARCHAR(60),
    premium TINYINT(1) NOT NULL DEFAULT 0,
    verification TINYINT(1) NOT NULL DEFAULT 0,
    token VARCHAR(8),
    created  TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (username, password, email, premium, verification, token)
    VALUES 
    ("putraganteng","putraganteng123","putraganteng@gmail.com",0,1,'88888888'),
    ("falah666","falah123","falah@gmail.com",0,1,'88888888'),
    ("gilang777","gilang123","gilang@gmail.com",0,1,'88888888');