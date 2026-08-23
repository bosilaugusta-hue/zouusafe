CREATE DATABASE IF NOT EXISTS zouusafe_db;
USE zouusafe_db;

CREATE TABLE parent (
    parent_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    pin_code VARCHAR(255) DEFAULT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE child (
    child_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    parent_id INT NOT NULL,
    gender VARCHAR(20) NOT NULL DEFAULT 'other',

    CONSTRAINT fk_child_parent
        FOREIGN KEY (parent_id)
        REFERENCES parent(parent_id)
);

CREATE TABLE password_reset_token (
    password_reset_token_id INT AUTO_INCREMENT PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used_at DATETIME DEFAULT NULL,
    parent_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_password_reset_parent
        FOREIGN KEY (parent_id)
        REFERENCES parent(parent_id)
        ON DELETE CASCADE
);

CREATE TABLE search_history (
    search_history_id INT AUTO_INCREMENT PRIMARY KEY,
    search_query VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    child_id INT NOT NULL,

    CONSTRAINT fk_search_history_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);

CREATE TABLE safety_setting (
    safety_setting_id INT AUTO_INCREMENT PRIMARY KEY,
    screen_time_limit INT NOT NULL,
    screen_time_used INT DEFAULT 0,
    filter_level VARCHAR(50) NOT NULL,
    safe_search TINYINT(1) NOT NULL DEFAULT 1,
    child_id INT NOT NULL UNIQUE,
    screen_time_date DATE DEFAULT NULL,

    CONSTRAINT fk_safety_setting_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);

CREATE TABLE blocked_content (
    blocked_content_id INT AUTO_INCREMENT PRIMARY KEY,
    content_name VARCHAR(255) NOT NULL,
    reason VARCHAR(255) NOT NULL,
    blocked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    child_id INT NOT NULL,

    CONSTRAINT fk_blocked_content_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);

CREATE TABLE blocked_site (
    blocked_site_id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT NOT NULL,
    child_id INT NOT NULL,
    domain VARCHAR(255) NOT NULL,
    reason VARCHAR(100) DEFAULT 'Choix du parent',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT blocked_site_ibfk_1
        FOREIGN KEY (parent_id)
        REFERENCES parent(parent_id)
        ON DELETE CASCADE,

    CONSTRAINT blocked_site_ibfk_2
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
        ON DELETE CASCADE
);

CREATE TABLE alert (
    alert_id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    child_id INT NOT NULL,

    CONSTRAINT fk_alert_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);

CREATE TABLE device (
    device_id INT AUTO_INCREMENT PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    last_connection DATETIME DEFAULT NULL,
    child_id INT NOT NULL,

    CONSTRAINT fk_device_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);