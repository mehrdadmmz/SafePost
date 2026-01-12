-- Add role column to users table for role-based authorization

-- Add role column with default value of ROLE_USER
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER';

-- Create index on role column for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update any existing users without a role to have ROLE_USER
UPDATE users SET role = 'ROLE_USER' WHERE role IS NULL OR role = '';
