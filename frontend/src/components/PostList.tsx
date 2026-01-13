import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardBody, CardFooter, CardHeader, Chip } from '@nextui-org/react';
import { Post } from '../services/apiService';
import { Calendar, Clock, Tag, Heart } from 'lucide-react';
import DOMPurify from 'dompurify';

interface PostListProps {
  posts: Post[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  sortBy: string;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  error,
}) => {

  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const createExcerpt = (content: string) => {
    // First sanitize the HTML
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'br'],
      ALLOWED_ATTR: []
    });
    
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizedContent;
    
    // Get the text content and limit it
    let textContent = tempDiv.textContent || tempDiv.innerText || '';
    textContent = textContent.trim();
    
    // Limit to roughly 200 characters, ending at the last complete word
    if (textContent.length > 200) {
      textContent = textContent.substring(0, 200).split(' ').slice(0, -1).join(' ') + '...';
    }
    
    return textContent;
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  const navToPostPage = (post: Post) => {
    navigate(`/posts/${post.id}`)
  }

  return (
    <div className="w-full space-y-6">
      {/* <div className="flex justify-end mb-4">
        <Select
          label="Sort by"
          selectedKeys={[sortBy]}
          className="max-w-xs"
          onChange={(e) => onSortChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div> */}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="w-full animate-pulse">
              <CardBody>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts?.map((post) => (
              <Card key={post.id} className="w-full p-2 article-card" isPressable={true} onPress={() => navToPostPage(post)}>
                <CardHeader className="flex justify-between items-start gap-3">
                    <h2 className="text-xl font-bold text-left flex-1">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-1 text-small text-default-500">
                      <Heart size={16} />
                      <span>{post.likesCount || 0}</span>
                    </div>
                </CardHeader>
                <CardBody>
                  <div className="flex gap-4">
                    {post.coverImageUrl && (
                      <div className="flex-shrink-0">
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <p className="line-clamp-3 flex-1">
                      {createExcerpt(post.content)}
                    </p>
                  </div>
                </CardBody>
                <CardFooter className="flex justify-between items-end gap-3">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-small text-default-500">
                      <Calendar size={16} />
                      {formatDate(post.createdAt)}
                    </div>
                    <div className="flex items-center gap-1 text-small text-default-500">
                      <Clock size={16} />
                      {post.readingTime} min read
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Chip
                        className="bg-primary-100 text-primary"
                      >
                        {post.category.name}
                      </Chip>
                      {post.tags.map((tag) => (
                        <Chip
                          key={tag.id}
                          className="bg-default-100"
                          startContent={<Tag size={14} />}
                        >
                          {tag.name}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <p className="text-small text-default-500 whitespace-nowrap">
                    by{' '}
                    <Link
                      to={`/users/${post.author?.id}/profile`}
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {post.author?.name}
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* {posts && posts.totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination
                total={posts.totalPages}
                page={page}
                onChange={onPageChange}
                showControls
              />
            </div>
          )} */}
        </>
      )}
    </div>
  );
};

export default PostList;