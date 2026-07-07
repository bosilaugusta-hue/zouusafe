CREATE DATABASE IF NOT EXISTS zouusafe_db;
USE zouusafe_db;

-- =========================
-- TABLE PARENT
-- =========================

CREATE TABLE parent (
    parent_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- TABLE CHILD
-- =========================

CREATE TABLE child (
    child_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    avatar_url VARCHAR(255),
    parent_id INT NOT NULL,

    CONSTRAINT fk_child_parent
        FOREIGN KEY (parent_id)
        REFERENCES parent(parent_id)
);

-- =========================
-- TABLE SAFETY_SETTING
-- =========================

CREATE TABLE safety_setting (
    safety_setting_id INT AUTO_INCREMENT PRIMARY KEY,
    screen_time_limit INT NOT NULL,
    screen_time_used INT DEFAULT 0,
    filter_level VARCHAR(50) NOT NULL,
    safe_search BOOLEAN DEFAULT TRUE,
    child_id INT NOT NULL UNIQUE,

    CONSTRAINT fk_safety_setting_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);

-- =========================
-- TABLE SEARCH_HISTORY
-- =========================

CREATE TABLE search_history (
    search_history_id INT AUTO_INCREMENT PRIMARY KEY,
    search_query VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    child_id INT NOT NULL,

    CONSTRAINT fk_search_history_child
        FOREIGN KEY (child_id)
        REFERENCES child(child_id)
);

-- =========================
-- TABLE BLOCKED_CONTENT
-- =========================

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

-- =========================
-- TABLE DEVICE
-- =========================

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

-- =========================
-- TABLE ALERT
-- =========================

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