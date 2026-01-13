import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Plus, Edit3, LogOut, BookDashed, Sun, Moon, User, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface NavBarProps {
  isAuthenticated: boolean;
  userProfile?: {
    name: string;
    avatar?: string;
    id?: string;
  };
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  isAuthenticated,
  userProfile,
  onLogout,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: "Tags", path: "/tags" },
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="mb-6"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <Link to="/" className="font-bold text-inherit text-lg">
            DevVault 🔐
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          <Link to="/" className="font-bold text-inherit text-lg">
            DevVault 🔐
          </Link>
        </NavbarBrand>
        {menuItems.map((item) => (
          <NavbarItem
            key={item.path}
            isActive={location.pathname === item.path}
          >
            <Link
              to={item.path}
              className={`text-sm ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-default-600"
              }`}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            isIconOnly
            variant="light"
            onPress={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </NavbarItem>
        {isAuthenticated ? (
          <>
            <NavbarItem>
              <Button
                as={Link}
                to="/posts/drafts"
                color="secondary"
                variant="flat"
                startContent={<BookDashed size={16} />}
              >
                My Drafts
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button
                as={Link}
                to="/posts/new"
                color="primary"
                variant="flat"
                startContent={<Plus size={16} />}
              >
                Share Knowledge
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    src={userProfile?.avatar}
                    name={userProfile?.name}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu">
                  <DropdownItem
                    key="profile"
                    startContent={<User size={16} />}
                    onPress={() => navigate(`/users/${userProfile?.id}/profile`)}
                  >
                    My Profile
                  </DropdownItem>
                  <DropdownItem
                    key="edit-profile"
                    startContent={<Settings size={16} />}
                    onPress={() => navigate('/profile/edit')}
                  >
                    Edit Profile
                  </DropdownItem>
                  <DropdownItem
                    key="drafts"
                    startContent={<Edit3 size={16} />}
                    onPress={() => navigate('/posts/drafts')}
                  >
                    My Articles
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    startContent={<LogOut size={16} />}
                    className="text-danger"
                    color="danger"
                    onPress={onLogout}
                  >
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Button as={Link} to="/login" variant="flat">
                Log In
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={item.path}>
            <Link
              to={item.path}
              className={`w-full ${
                location.pathname === item.path
                  ? "text-primary"
                  : "text-default-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default NavBar;
