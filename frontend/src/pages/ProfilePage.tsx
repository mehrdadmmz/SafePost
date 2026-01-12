import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Chip,
} from '@nextui-org/react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  Twitter,
  Github,
  Linkedin,
  Globe,
} from 'lucide-react';
import { apiService, UserProfile } from '../services/apiService';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error('User ID is required');
        const fetchedProfile = await apiService.getPublicProfile(id);
        setProfile(fetchedProfile);
        setError(null);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full animate-pulse">
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 bg-default-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-default-200 rounded w-1/3"></div>
                <div className="h-4 bg-default-200 rounded w-1/2"></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardBody>
            <p className="text-danger">{error || 'Profile not found'}</p>
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
    <div className="max-w-4xl mx-auto px-4 space-y-6">
      {/* Back Button */}
      <Button
        as={Link}
        to="/"
        variant="flat"
        startContent={<ArrowLeft size={16} />}
        size="sm"
      >
        Back to Posts
      </Button>

      {/* Profile Card */}
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <Avatar
                src={profile.avatarUrl}
                name={profile.name}
                className="w-32 h-32 text-large"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-default-500">{profile.email}</p>
                <Chip size="sm" className="mt-2" color="primary" variant="flat">
                  {profile.role}
                </Chip>
              </div>

              {profile.bio && (
                <p className="text-default-700">{profile.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 text-small text-default-500">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin size={16} />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Joined {formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText size={16} />
                  <span>{profile.postCount || 0} posts</span>
                </div>
              </div>

              {/* Social Links */}
              {(profile.twitterUrl || profile.githubUrl || profile.linkedinUrl || profile.websiteUrl) && (
                <div className="flex flex-wrap gap-2">
                  {profile.twitterUrl && (
                    <Button
                      as="a"
                      href={profile.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="flat"
                      startContent={<Twitter size={16} />}
                    >
                      Twitter
                    </Button>
                  )}
                  {profile.githubUrl && (
                    <Button
                      as="a"
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="flat"
                      startContent={<Github size={16} />}
                    >
                      GitHub
                    </Button>
                  )}
                  {profile.linkedinUrl && (
                    <Button
                      as="a"
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="flat"
                      startContent={<Linkedin size={16} />}
                    >
                      LinkedIn
                    </Button>
                  )}
                  {profile.websiteUrl && (
                    <Button
                      as="a"
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="sm"
                      variant="flat"
                      startContent={<Globe size={16} />}
                    >
                      Website
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfilePage;
