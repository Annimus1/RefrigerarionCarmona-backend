-- create database
CREATE DATABASE RCARMONA;

-- use Database
USE RCARMONA;

-- create leads table 
CREATE TABLE leads(
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    message VARCHAR(255) NOT NULL,
    date DATE NOT NULL DEFAULT (CURRENT_DATE())
);
INSERT INTO leads(message) values("initializing database");


-- create clients table
--      property "quality" It is the level of reliability that the client has at the time of payment.
CREATE TABLE clients(
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id varchar(36) default(uuid()),
    quality FLOAT default 2.5,
    role ENUM('admin', 'user') DEFAULT('user'),
    name VARCHAR(20) NOT NULL,
    lastName VARCHAR(20) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    password VARCHAR(40)
);
INSERT INTO clients(name, lastName, phone, role) VALUES("Pablo","Vergara","04241122345","admin");
INSERT INTO clients(name, lastName, phone) VALUES("Jhon","Doe","+584123345098"),("Jane", "Doe", "04241111444");

-- create jobs table
CREATE TABLE jobs(
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    owner INTEGER UNSIGNED NOT NULL,
    client INTEGER UNSIGNED NOT NULL,
    category ENUM("mantenimiento", "instalacion", "reparacion"),
    creation_date DATE NOT NULL DEFAULT (CURRENT_DATE()),
    update_date DATE NOT NULL DEFAULT (CURRENT_DATE()),
    warranty_expiration_date DATE NOT NULL,
    warranty_coverage VARCHAR(255) NOT NULL,
    price DECIMAL(6,2),
    note VARCHAR(255),
    status ENUM("pendiente", "realizado") DEFAULT 'pendiente',
    payment_status ENUM("pendiente", "pagado") DEFAULT 'pendiente',

    FOREIGN KEY (owner) REFERENCES clients(id),
    FOREIGN KEY (client) REFERENCES clients(id)
);
INSERT INTO jobs(owner, client, category, warranty_expiration_date, price, note, warranty_coverage) 
VALUES(3,1,"mantenimiento", "2024-10-18",20,"aire de ventana 12.000BTU","ruidos extra#os y descompresion"),
      (3,2,"instalacion", "2025-09-18", 1500, "Cava cuarto con motor de 3HP trifasico", "full garantia y servicio tecnico. exceptuando motor quemado devido a falla de voltage.");

-- create claim warranty table
CREATE TABLE claim_warranty(
    id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    job INTEGER UNSIGNED NOT NULL,
    date DATE NOT NULL DEFAULT (CURRENT_DATE()),

    FOREIGN KEY (job) REFERENCES jobs(id)
);
INSERT INTO claim_warranty(job) VALUES(1);

-- create jwt table
CREATE TABLE jwt(
    jwt VARCHAR(500) NOT NULL,
    userID INTEGER UNSIGNED,

    FOREIGN KEY (userID) REFERENCES clients(id),
    PRIMARY KEY (jwt, userID)
);
-- INSERT INTO jwt(jwt, userID) VALUES("", 3)
