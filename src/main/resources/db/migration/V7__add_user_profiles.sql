-- Add user profile fields
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS bio TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS avatar_filename VARCHAR(255),
    ADD COLUMN IF NOT EXISTS twitter_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS github_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS website_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS location VARCHAR(255),
    ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMP;

-- Add index on avatar_filename for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_avatar ON users(avatar_filename) WHERE avatar_filename IS NOT NULL;
