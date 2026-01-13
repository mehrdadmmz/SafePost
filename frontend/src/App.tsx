import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import EditPostPage from "./pages/EditPostPage";
import PostPage from "./pages/PostPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagsPage from "./pages/TagsPage";
import DraftsPage from "./pages/DraftsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { Toaster } from "react-hot-toast";

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <NavBar
          isAuthenticated={isAuthenticated}
          userProfile={user ? {
            name: user.name,
            avatar: user.avatarUrl,
            id: user.id
          } : undefined}
          onLogout={logout}
        />
        <main className="container mx-auto py-6 flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/posts/new"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts/:id"
              element={
                <PostPage
                  isAuthenticated={isAuthenticated}
                  currentUserId={user?.id}
                  currentUserRole={user?.role}
                />
              }
            />
            <Route
              path="/posts/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route path="/categories" element={<CategoriesPage isAuthenticated={isAuthenticated}/>} />
            <Route path="/tags" element={<TagsPage isAuthenticated={isAuthenticated}/>} />
            <Route
              path="/posts/drafts"
              element={
                <ProtectedRoute>
                  <DraftsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/users/:id/profile" element={<ProfilePage />} />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
                }
              />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--nextui-colors-background)',
              color: 'var(--nextui-colors-foreground)',
              border: '1px solid var(--nextui-colors-default-200)',
            },
            success: {
              iconTheme: {
                primary: '#17c964',
                secondary: 'white',
              },
            },
            error: {
              iconTheme: {
                primary: '#f31260',
                secondary: 'white',
              },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;