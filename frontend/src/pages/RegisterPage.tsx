import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
} from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import PasswordRequirements from '../components/PasswordRequirements';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const validatePassword = (password: string): boolean => {
    const requirements = [
      /.{8,}/, // At least 8 characters
      /[A-Z]/, // One uppercase letter
      /[a-z]/, // One lowercase letter
      /[0-9]/, // One number
      /[!@#$%^&*]/, // One special character
    ];

    return requirements.every((regex) => regex.test(password));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password does not meet all requirements');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center pb-6 pt-8">
          <h1 className="text-2xl font-bold">Join DevVault</h1>
          <p className="text-sm text-default-500">
            Start sharing your developer knowledge today
          </p>
        </CardHeader>

        <CardBody className="gap-4 px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-100/10 border border-danger-200 dark:border-danger-200/20">
                <p className="text-sm text-danger dark:text-danger-500">{error}</p>
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isRequired
              isDisabled={isLoading}
              startContent={<User size={18} className="text-default-400" />}
              classNames={{
                input: "dark:text-foreground",
                inputWrapper: "dark:bg-default-100",
              }}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isRequired
              isDisabled={isLoading}
              startContent={<Mail size={18} className="text-default-400" />}
              classNames={{
                input: "dark:text-foreground",
                inputWrapper: "dark:bg-default-100",
              }}
            />

            <div>
              <Input
                label="Password"
                placeholder="Create a password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                isDisabled={isLoading}
                startContent={<Lock size={18} className="text-default-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-default-400 cursor-pointer" />
                    ) : (
                      <Eye size={18} className="text-default-400 cursor-pointer" />
                    )}
                  </button>
                }
                classNames={{
                  input: "dark:text-foreground",
                  inputWrapper: "dark:bg-default-100",
                }}
              />
              {password && <PasswordRequirements password={password} />}
            </div>

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              isRequired
              isDisabled={isLoading}
              startContent={<Lock size={18} className="text-default-400" />}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="text-default-400 cursor-pointer" />
                  ) : (
                    <Eye size={18} className="text-default-400 cursor-pointer" />
                  )}
                </button>
              }
              classNames={{
                input: "dark:text-foreground",
                inputWrapper: "dark:bg-default-100",
              }}
            />

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <Divider className="my-2" />

          <p className="text-center text-sm text-default-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default RegisterPage;
