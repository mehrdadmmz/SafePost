import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'lucide-react';
import { apiService } from '../services/apiService';

interface LikeButtonProps {
  postId: string;
  initialLikesCount?: number;
  isAuthenticated: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  initialLikesCount = 0,
  isAuthenticated,
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!isAuthenticated) return;

      try {
        const status = await apiService.getLikeStatus(postId);
        setLiked(status.liked);
        setLikesCount(status.likesCount);
      } catch (error) {
        console.error('Failed to fetch like status:', error);
      }
    };

    fetchLikeStatus();
  }, [postId, isAuthenticated]);

  const handleToggle = async () => {
    if (!isAuthenticated) {
      // Optionally show login prompt
      return;
    }

    // Optimistic UI update
    const previousLiked = liked;
    const previousCount = likesCount;

    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setIsLoading(true);

    try {
      const response = await apiService.toggleLike(postId);
      setLiked(response.liked);
      setLikesCount(response.likesCount);
    } catch (error) {
      // Revert on error
      setLiked(previousLiked);
      setLikesCount(previousCount);
      console.error('Failed to toggle like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      color={liked ? 'danger' : 'default'}
      variant={liked ? 'solid' : 'bordered'}
      startContent={
        <Heart
          size={18}
          fill={liked ? 'currentColor' : 'none'}
        />
      }
      onClick={handleToggle}
      isLoading={isLoading}
      isDisabled={!isAuthenticated}
      size="sm"
    >
      {likesCount}
    </Button>
  );
};
