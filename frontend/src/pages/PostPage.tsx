import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Button,
  Divider,
  Avatar,
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from '@nextui-org/react';
import {
  Calendar,
  Clock,
  Tag,
  Edit,
  Trash,
  ArrowLeft,
  Eye
} from 'lucide-react';
import { apiService, Post } from '../services/apiService';
import { LikeButton } from '../components/LikeButton';
import ShareMenu from '../components/ShareMenu';
import { ConfirmModal, useConfirmModal } from '../components/ConfirmModal';
import { useCodeBlockCopy } from '../components/CodeBlockWithCopy';

interface PostPageProps {
  isAuthenticated?: boolean;
  currentUserId?: string;
  currentUserRole?: string;
}

const PostPage: React.FC<PostPageProps> = ({
  isAuthenticated,
  currentUserId,
  currentUserRole
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, openConfirm, closeConfirm, config: confirmConfig } = useConfirmModal();

  // Add copy buttons to code blocks
  useCodeBlockCopy();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('Post ID is required');
        const fetchedPost = await apiService.getPost(id);
        setPost(fetchedPost);
        setError(null);
      } catch (err) {
        setError('Failed to load the post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const confirmDelete = () => {
    if (!post) return;

    openConfirm({
      title: 'Delete Article',
      message: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      isLoading: isDeleting,
      onConfirm: handleDelete,
    });
  };

  const handleDelete = async () => {
    if (!post) return;

    try {
      setIsDeleting(true);
      await apiService.deletePost(post.id);
      navigate('/');
    } catch (err) {
      setError('Failed to delete the post. Please try again later.');
      setIsDeleting(false);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const createSanitizedHTML = (content: string) => {
    return {
      __html: DOMPurify.sanitize(content, {
        ALLOWED_TAGS: ['p', 'strong', 'em', 'br', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'pre', 'code', 'span'],
        ALLOWED_ATTR: ['class']
      })
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full animate-pulse">
          <CardBody>
            <div className="h-8 bg-default-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-2/3"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardBody>
            <p className="text-danger">{error || 'Post not found'}</p>
            <Button
              as={Link}
              to="/"
              color="primary"
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              className="mt-4"
            >
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="w-full">
        <CardHeader className="flex flex-col items-start gap-3">
          <div className="flex justify-between w-full">
            <Button
              as={Link}
              to="/"
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              size="sm"
            >
              Back to Posts
            </Button>
            <div className="flex gap-2">
              {isAuthenticated && currentUserId && post.author?.id === currentUserId && (
                <Button
                  as={Link}
                  to={`/posts/${post.id}/edit`}
                  color="primary"
                  variant="flat"
                  startContent={<Edit size={16} />}
                  size="sm"
                >
                  Edit
                </Button>
              )}
              {isAuthenticated && currentUserId && (post.author?.id === currentUserId || currentUserRole === 'ADMIN') && (
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<Trash size={16} />}
                  onClick={confirmDelete}
                  isLoading={isDeleting}
                  size="sm"
                >
                  Delete
                </Button>
              )}
              <ShareMenu
                url={window.location.href}
                title={post.title}
                description={post.content.substring(0, 200)}
              />
              <LikeButton
                postId={post.id}
                initialLikesCount={post.likesCount}
                isAuthenticated={isAuthenticated || false}
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar
                name={post.author?.name}
                size="sm"
              />
              <Link
                to={`/users/${post.author?.id}/profile`}
                className="text-default-600 hover:text-primary hover:underline"
              >
                {post.author?.name}
              </Link>
            </div>
            <div className="flex items-center gap-2 text-default-500">
              <Calendar size={16} />
              <span>{formatDate(post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2 text-default-500">
              <Clock size={16} />
              <span>{post.readingTime} min read</span>
            </div>
            {post.viewCount !== undefined && (
              <div className="flex items-center gap-2 text-default-500">
                <Eye size={16} />
                <span>{post.viewCount} {post.viewCount === 1 ? 'view' : 'views'}</span>
              </div>
            )}
          </div>
        </CardHeader>

        <Divider />

        {post.coverImageUrl && (
          <div className="w-full flex justify-center bg-default-100 cursor-pointer" onClick={onOpen}>
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="max-h-80 w-auto object-contain hover:opacity-90 transition-opacity"
            />
          </div>
        )}

        <CardBody>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={createSanitizedHTML(post.content)}
          />
        </CardBody>

        <CardFooter className="flex flex-col items-start gap-4">
          <Divider />
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" variant="flat">
              {post.category.name}
            </Chip>
            {post.tags.map((tag) => (
              <Chip
                key={tag.id}
                variant="flat"
                startContent={<Tag size={14} />}
              >
                {tag.name}
              </Chip>
            ))}
          </div>
        </CardFooter>
      </Card>

      {/* Image Preview Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        classNames={{
          body: "p-0",
          base: "bg-transparent shadow-none"
        }}
      >
        <ModalContent>
          <ModalBody>
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-auto max-h-[90vh] object-contain"
              onClick={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        {...confirmConfig}
      />
    </div>
  );
};

export default PostPage;