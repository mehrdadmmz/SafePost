-- Add cover image columns to posts table
ALTER TABLE posts
    ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(500),
    ADD COLUMN IF NOT EXISTS cover_image_filename VARCHAR(255),
    ADD COLUMN IF NOT EXISTS cover_image_size BIGINT,
    ADD COLUMN IF NOT EXISTS cover_image_content_type VARCHAR(100);

-- Add index for cover image queries
CREATE INDEX IF NOT EXISTS idx_posts_cover_image ON posts(cover_image_filename) WHERE cover_image_filename IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN posts.cover_image_url IS 'URL path to the cover image file';
COMMENT ON COLUMN posts.cover_image_filename IS 'Unique filename of the cover image';
COMMENT ON COLUMN posts.cover_image_size IS 'Size of the cover image in bytes';
COMMENT ON COLUMN posts.cover_image_content_type IS 'MIME type of the cover image';
