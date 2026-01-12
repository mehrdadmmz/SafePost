-- Add likes count column to posts table
ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0 NOT NULL;

-- Add index for sorting by likes
CREATE INDEX IF NOT EXISTS idx_posts_likes_count ON posts(likes_count DESC);

-- Create post_likes junction table
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_post_user_like UNIQUE (post_id, user_id)
);

-- Add indexes for post_likes table
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_created_at ON post_likes(created_at DESC);

-- Add comments for documentation
COMMENT ON COLUMN posts.likes_count IS 'Denormalized count of likes for fast reads';
COMMENT ON TABLE post_likes IS 'Junction table for post likes - tracks which users liked which posts';
COMMENT ON CONSTRAINT uk_post_user_like ON post_likes IS 'Ensures a user can only like a post once';
