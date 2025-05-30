DROP DATABASE IF EXISTS bobozoo;
CREATE DATABASE bobozoo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bobozoo;

-- 建立 members 表（先基本欄位）
CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_subscribed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 補充新增欄位
ALTER TABLE members
ADD COLUMN name VARCHAR(50),
ADD COLUMN birth DATE,
ADD COLUMN gender ENUM('male', 'female');

