-- Add view_count column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0 NOT NULL;

-- Add index for sorting by views (most popular posts)
CREATE INDEX IF NOT EXISTS idx_posts_view_count ON posts(view_count DESC);

-- Update existing posts to have 0 views
UPDATE posts SET view_count = 0 WHERE view_count IS NULL;
