import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Textarea,
  Avatar,
} from '@nextui-org/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { apiService, UserProfile } from '../services/apiService';
import { useAuth } from '../components/AuthContext';

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [avatarFilename, setAvatarFilename] = useState<string | undefined>(undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        if (!user?.id) throw new Error('User not authenticated');
        const fetchedProfile = await apiService.getPublicProfile(user.id);
        setProfile(fetchedProfile);

        // Populate form fields
        setBio(fetchedProfile.bio || '');
        setLocation(fetchedProfile.location || '');
        setTwitterUrl(fetchedProfile.twitterUrl || '');
        setGithubUrl(fetchedProfile.githubUrl || '');
        setLinkedinUrl(fetchedProfile.linkedinUrl || '');
        setWebsiteUrl(fetchedProfile.websiteUrl || '');
        setAvatarUrl(fetchedProfile.avatarUrl);
        setAvatarPreview(fetchedProfile.avatarUrl);

        setError(null);
      } catch (err) {
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPG, PNG, GIF, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      setError(null);
      const response = await apiService.uploadAvatar(file);
      setAvatarUrl(response.url);
      setAvatarFilename(response.filename);
    } catch (err) {
      setError('Failed to upload avatar');
      setAvatarPreview(avatarUrl); // Revert preview
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null as any);
    setAvatarFilename(null as any);
    setAvatarPreview(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);

      await apiService.updateProfile({
        bio: bio.trim() || null,
        location: location.trim() || null,
        twitterUrl: twitterUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        linkedinUrl: linkedinUrl.trim() || null,
        websiteUrl: websiteUrl.trim() || null,
        avatarUrl: avatarUrl ?? null,
        avatarFilename: avatarFilename ?? null,
      });

      // Refresh the user profile in AuthContext to update navbar avatar
      await refreshProfile();

      navigate(`/users/${user?.id}/profile`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/users/${user?.id}/profile`);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="w-full animate-pulse">
          <CardBody>
            <div className="h-8 bg-default-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-default-200 rounded w-full"></div>
              <div className="h-4 bg-default-200 rounded w-full"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <Card className="w-full">
        <CardHeader className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="flat"
              startContent={<ArrowLeft size={16} />}
              onClick={handleCancel}
            >
              Back
            </Button>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
          </div>
        </CardHeader>

        <CardBody>
          {error && (
            <div className="mb-4 p-4 text-red-500 bg-red-50 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Profile Picture</label>
              <div className="flex items-center gap-4">
                <Avatar
                  src={avatarPreview}
                  name={profile?.name}
                  className="w-24 h-24 text-large"
                />
                <div className="flex gap-2">
                  <Button
                    as="label"
                    htmlFor="avatar-upload"
                    variant="flat"
                    startContent={<Upload size={16} />}
                    isLoading={uploading}
                  >
                    Upload
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  {avatarPreview && (
                    <Button
                      variant="flat"
                      color="danger"
                      startContent={<X size={16} />}
                      onClick={handleRemoveAvatar}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-xs text-default-500">
                JPG, PNG, GIF or WebP. Max size 5MB.
              </p>
            </div>

            {/* Bio */}
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={1000}
              description={`${bio.length}/1000 characters`}
            />

            {/* Location */}
            <Input
              label="Location"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Links</h3>

              <Input
                label="Twitter/X URL"
                placeholder="https://twitter.com/username"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
                type="url"
              />

              <Input
                label="GitHub URL"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                type="url"
              />

              <Input
                label="LinkedIn URL"
                placeholder="https://linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                type="url"
              />

              <Input
                label="Website URL"
                placeholder="https://yourwebsite.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                type="url"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                color="danger"
                variant="flat"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                isLoading={saving}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfilePage;
