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
  Checkbox,
} from '@nextui-org/react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 items-center pb-6 pt-8">
          <h1 className="text-2xl font-bold">Sign in to DevVault</h1>
          <p className="text-sm text-default-500">
            Welcome back! Access your vault of knowledge
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

            <Input
              label="Password"
              placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <Checkbox
                size="sm"
                isSelected={rememberMe}
                onValueChange={setRememberMe}
              >
                <span className="text-sm">Remember me</span>
              </Checkbox>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <Divider className="my-2" />

          <p className="text-center text-sm text-default-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
