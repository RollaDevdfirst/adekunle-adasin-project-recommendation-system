CREATE DATABASE IF NOT EXISTS edureach;
USE edureach;

-- ── Users ──
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)        NOT NULL,
  email        VARCHAR(150)        NOT NULL UNIQUE,
  password     VARCHAR(255)        NOT NULL,
  role         ENUM('student','admin') DEFAULT 'student',
  created_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);c

-- ── Resources ──
CREATE TABLE IF NOT EXISTS resources (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(255)        NOT NULL,
  course       VARCHAR(100)        NOT NULL,
  type         ENUM('PDF','Video','Link') NOT NULL,
  link         TEXT                NOT NULL,
  keywords     TEXT                NULL,
  created_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP
);

-- ── Recommendations log ──
CREATE TABLE IF NOT EXISTS recommendations (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT                 NOT NULL,
  resource_id  INT                 NOT NULL,
  created_at   TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- ── Seed: default admin account ──
-- Password is: Admin@1234  (bcrypt hashed)
INSERT IGNORE INTO users (name, email, password, role) VALUES (
  'Admin',
  'admin@edureach.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

-- ── Seed: sample resources ──
INSERT IGNORE INTO resources (id, title, course, type, link, keywords) VALUES
(1, 'Introduction to Calculus – Lecture Notes', 'Mathematics', 'PDF',   'https://example.com/calculus.pdf',   'calculus,limits,derivatives,integration,mathematics'),
(2, 'Limits and Continuity – Video Series',     'Mathematics', 'Video', 'https://example.com/limits-video',   'limits,continuity,calculus,mathematics'),
(3, 'Data Structures & Algorithms Overview',    'Computer Science', 'PDF',   'https://example.com/dsa.pdf',        'data structures,algorithms,arrays,linked list,computer science'),
(4, 'Sorting Algorithms Visualised',            'Computer Science', 'Video', 'https://example.com/sorting',        'sorting,algorithms,bubble sort,quicksort,computer science'),
(5, 'Thermodynamics Practice Problems',         'Physics', 'PDF',   'https://example.com/thermo.pdf',     'thermodynamics,heat,energy,physics'),
(6, 'Newton Laws – Lecture Slides',             'Physics', 'Link',  'https://example.com/newton',         'newton,laws of motion,force,physics'),
(7, 'Introduction to Organic Chemistry',        'Chemistry', 'PDF', 'https://example.com/organic-chem.pdf','organic chemistry,molecules,bonds,chemistry'),
(8, 'Microeconomics – Supply and Demand',       'Economics', 'Video','https://example.com/microeconomics', 'microeconomics,supply,demand,economics,market');