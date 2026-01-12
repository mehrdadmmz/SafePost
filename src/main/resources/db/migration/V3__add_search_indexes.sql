-- Add full-text search indexes for better performance
-- Using GIN indexes for PostgreSQL full-text search

-- Index on posts title for faster text search
CREATE INDEX IF NOT EXISTS idx_posts_title_search ON posts USING gin(to_tsvector('english', title));

-- Index on posts content for faster text search
CREATE INDEX IF NOT EXISTS idx_posts_content_search ON posts USING gin(to_tsvector('english', content));

-- Index on users name for faster author search
CREATE INDEX IF NOT EXISTS idx_users_name_search ON users USING gin(to_tsvector('english', name));

-- Composite index for combined searches (title and content)
CREATE INDEX IF NOT EXISTS idx_posts_title_content ON posts(title, content);

-- Index for case-insensitive searches (using LOWER function)
CREATE INDEX IF NOT EXISTS idx_posts_title_lower ON posts(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_users_name_lower ON users(LOWER(name));
