-- init.sql for gxpt project
CREATE DATABASE IF NOT EXISTS gxpt_platform CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE gxpt_platform;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type ENUM('supply','demand') NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  keywords VARCHAR(255),
  start_time DATETIME,
  end_time DATETIME,
  status ENUM('active','expired') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message_id INT NOT NULL,
  matched_message_id INT NOT NULL,
  matched_type VARCHAR(100),
  matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
  FOREIGN KEY (matched_message_id) REFERENCES messages(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_messages_keywords ON messages(keywords);

-- create MySQL user (run as root) - comment out if you prefer manual creation
CREATE USER IF NOT EXISTS 'gxpt_user'@'localhost' IDENTIFIED BY 'kH8x!pZ3R@tq';
GRANT ALL PRIVILEGES ON gxpt_platform.* TO 'gxpt_user'@'localhost';
FLUSH PRIVILEGES;
