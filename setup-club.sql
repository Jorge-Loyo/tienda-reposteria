-- Configuración del club
CREATE TABLE IF NOT EXISTS club_config (
  id SERIAL PRIMARY KEY,
  points_per_dollar DECIMAL(10,2) DEFAULT 1.00,
  first_prize DECIMAL(10,2) DEFAULT 200.00,
  second_prize DECIMAL(10,2) DEFAULT 100.00,
  third_prize DECIMAL(10,2) DEFAULT 50.00,
  bronze_threshold INTEGER DEFAULT 0,
  silver_threshold INTEGER DEFAULT 500,
  gold_threshold INTEGER DEFAULT 1500,
  bronze_cashback DECIMAL(5,2) DEFAULT 2.00,
  silver_cashback DECIMAL(5,2) DEFAULT 5.00,
  gold_cashback DECIMAL(5,2) DEFAULT 8.00,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Puntos de usuarios
CREATE TABLE IF NOT EXISTS user_points (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_points INTEGER DEFAULT 0,
  monthly_points INTEGER DEFAULT 0,
  current_month INTEGER DEFAULT EXTRACT(MONTH FROM CURRENT_DATE),
  current_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  level VARCHAR(20) DEFAULT 'BRONZE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historial de puntos
CREATE TABLE IF NOT EXISTS points_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  order_id INTEGER REFERENCES orders(id),
  points_earned INTEGER,
  reason VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ganadores mensuales
CREATE TABLE IF NOT EXISTS monthly_winners (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  month INTEGER,
  year INTEGER,
  position INTEGER,
  points INTEGER,
  prize_amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar configuración inicial
INSERT INTO club_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;