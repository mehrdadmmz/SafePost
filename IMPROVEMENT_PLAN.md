# SafePost - UI/UX Improvements Plan

## Overview
Three major improvement areas:
1. **Enhanced Share Functionality** - Social media integration
2. **Dark Mode Polish** - Fix auth pages styling and UX
3. **OAuth Integration** - Google & GitHub social login

---

## PHASE 1: Enhanced Share Functionality

### Features
1. **Share Menu Dropdown** - Replace simple share button with multi-platform options
2. **Platform Integration** - Direct sharing to popular platforms
3. **Copy Link** - Quick copy-to-clipboard functionality
4. **Share Analytics** - Track share counts (optional)

### Platforms to Support
- **Twitter/X** - Share with pre-filled text and link
- **Facebook** - Facebook share dialog
- **LinkedIn** - Professional sharing
- **WhatsApp** - Direct WhatsApp share
- **Reddit** - Submit to Reddit
- **Email** - mailto: link with subject and body
- **Copy Link** - Clipboard API with success toast

### Implementation

#### Frontend Changes
**ShareMenu.tsx** (NEW) - Reusable share component:
```tsx
interface ShareMenuProps {
  url: string;
  title: string;
  description?: string;
}

// Features:
- Dropdown menu with all platform options
- Platform icons (from lucide-react)
- Copy link with toast notification
- Mobile-friendly Web Share API fallback
```

**PostPage.tsx** - Replace Share button:
```tsx
<ShareMenu
  url={window.location.href}
  title={post.title}
  description={post.content.substring(0, 200)}
/>
```

**utils/shareUtils.ts** (NEW) - Share URL builders:
```ts
export const shareUrls = {
  twitter: (url, text) => `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  linkedin: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  whatsapp: (url, text) => `https://wa.me/?text=${text}%20${url}`,
  reddit: (url, title) => `https://reddit.com/submit?url=${url}&title=${title}`,
  email: (url, subject, body) => `mailto:?subject=${subject}&body=${body}%0A%0A${url}`
};
```

### Additional Ideas
- **Native Web Share API** - Use browser's native share on mobile devices
- **QR Code** - Generate QR code for post URL
- **Embed Code** - Provide embed code for the post
- **Share Count** - Display number of times post was shared (requires backend tracking)

---

## PHASE 2: Dark Mode Polish & Auth UX

### 2.1 Dark Mode Theme Fixes

#### Problems to Fix
1. Login/Register pages have white background in center on dark mode
2. Input fields have black text on black background (invisible)
3. Overall inconsistent dark mode styling on auth pages

#### Frontend Changes

**LoginPage.tsx & RegisterPage.tsx** - Full dark mode support:
```tsx
// Wrapper with proper dark mode classes
<div className="min-h-screen flex items-center justify-center bg-background">
  <Card className="w-full max-w-md bg-content1">
    {/* Card automatically inherits dark mode from NextUI */}
  </Card>
</div>

// Inputs with proper contrast
<Input
  className="dark:text-foreground"
  classNames={{
    input: "dark:text-foreground",
    inputWrapper: "dark:bg-default-100"
  }}
/>
```

**App.css / Tailwind config** - Ensure proper dark mode variables:
```css
@layer base {
  :root.dark {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;
  }
}
```

### 2.2 Password Requirements Validator

#### Features
- Real-time password validation
- Visual checklist with checkmarks/X icons
- Requirements:
  - ✓ Minimum 8 characters
  - ✓ At least one uppercase letter
  - ✓ At least one lowercase letter
  - ✓ At least one number
  - ✓ At least one special character

#### Frontend Changes

**PasswordRequirements.tsx** (NEW) - Visual requirements component:
```tsx
interface Requirement {
  label: string;
  regex: RegExp;
  met: boolean;
}

const requirements = [
  { label: "At least 8 characters", regex: /.{8,}/ },
  { label: "One uppercase letter", regex: /[A-Z]/ },
  { label: "One lowercase letter", regex: /[a-z]/ },
  { label: "One number", regex: /[0-9]/ },
  { label: "One special character", regex: /[!@#$%^&*]/ }
];

// Display with Check/X icons and green/red colors
```

**RegisterPage.tsx** - Add password requirements:
```tsx
<Input
  type={showPassword ? "text" : "password"}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  endContent={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff /> : <Eye />}
    </button>
  }
/>
<PasswordRequirements password={password} />
```

#### Backend Changes

**User.java** - Add password validation annotation:
```java
@Pattern(
  regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
  message = "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
)
private String password;
```

### 2.3 Additional Auth UX Improvements

**Features to Add:**
1. **Show/Hide Password Toggle** - Eye icon to reveal password
2. **Remember Me** - Checkbox to persist login (extend JWT expiry)
3. **Forgot Password** - Email-based password reset flow (future)
4. **Form Validation** - Client-side validation with error messages
5. **Loading States** - Disable buttons and show spinners during API calls
6. **Success Messages** - "Registration successful!" toast notifications

---

## PHASE 3: OAuth Social Login

### 3.1 Google OAuth Integration

#### Why Google?
- Most popular OAuth provider
- Simple integration with Spring Security
- Users trust Google authentication
- No need to manage passwords for Google users

#### Backend Changes

**Dependencies** (pom.xml):
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-oauth2-client</artifactId>
</dependency>
```

**application.properties**:
```properties
# Google OAuth2
spring.security.oauth2.client.registration.google.client-id=${GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret=${GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.scope=profile,email
spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/google

# GitHub OAuth2 (optional)
spring.security.oauth2.client.registration.github.client-id=${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=${GITHUB_CLIENT_SECRET}
spring.security.oauth2.client.registration.github.scope=user:email
spring.security.oauth2.client.registration.github.redirect-uri={baseUrl}/login/oauth2/code/github
```

**SecurityConfig.java** - Add OAuth2 login:
```java
@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .oauth2Login(oauth2 -> oauth2
            .userInfoEndpoint(userInfo -> userInfo
                .userService(customOAuth2UserService)
            )
            .successHandler(oauth2SuccessHandler)
        )
        // ... existing config
}
```

**CustomOAuth2UserService.java** (NEW):
```java
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oauth2User = super.loadUser(userRequest);

        // Extract user info
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        // Find or create user
        User user = userRepository.findByEmail(email)
            .orElseGet(() -> createUserFromOAuth2(email, name, picture));

        return new BlogUserDetails(user);
    }

    private User createUserFromOAuth2(String email, String name, String picture) {
        User user = User.builder()
            .email(email)
            .name(name)
            .avatarUrl(picture)
            .role(Role.USER)
            .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Random password
            .oauthProvider("GOOGLE")
            .build();
        return userRepository.save(user);
    }
}
```

**OAuth2SuccessHandler.java** (NEW):
```java
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                       HttpServletResponse response,
                                       Authentication authentication) {
        // Generate JWT token
        String token = jwtService.generateToken(authentication);

        // Redirect to frontend with token
        String redirectUrl = String.format("http://localhost/?token=%s", token);
        response.sendRedirect(redirectUrl);
    }
}
```

**User.java** - Add OAuth fields:
```java
@Column(length = 50)
private String oauthProvider; // "GOOGLE", "GITHUB", null for email/password

@Column
private String oauthId; // Provider's user ID
```

**Migration** - V8__add_oauth_fields.sql:
```sql
ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50);
ALTER TABLE users ADD COLUMN oauth_id VARCHAR(255);
ALTER TABLE users ALTER COLUMN password DROP NOT NULL; -- Allow null for OAuth users
```

#### Frontend Changes

**LoginPage.tsx** - Add OAuth buttons:
```tsx
<div className="space-y-2">
  <Button
    fullWidth
    variant="bordered"
    startContent={<img src="/google-icon.svg" className="w-5 h-5" />}
    onClick={() => window.location.href = '/api/v1/oauth2/authorization/google'}
  >
    Continue with Google
  </Button>

  <Button
    fullWidth
    variant="bordered"
    startContent={<Github size={20} />}
    onClick={() => window.location.href = '/api/v1/oauth2/authorization/github'}
  >
    Continue with GitHub
  </Button>
</div>

<Divider className="my-4">
  <span className="text-sm text-default-400">OR</span>
</Divider>

{/* Existing email/password form */}
```

**App.tsx** - Handle OAuth callback:
```tsx
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    localStorage.setItem('token', token);
    // Fetch user profile and redirect
    // ...
  }
}, []);
```

### 3.2 GitHub OAuth Integration

Same approach as Google, but using GitHub:
- Good for developer-focused blog platform
- GitHub provides: username, email, avatar, bio
- Can auto-populate profile fields from GitHub data

---

## PHASE 4: Additional Enhancements (Optional)

### 4.1 Share Analytics
Track how many times each post has been shared:
- Add `share_count` to posts table
- Increment counter when share buttons clicked
- Display share count on post cards

### 4.2 Password Reset Flow
Complete "Forgot Password" functionality:
- Email-based password reset
- Temporary reset tokens
- Email service integration (SendGrid, AWS SES)

### 4.3 Two-Factor Authentication (2FA)
Enhanced security:
- TOTP-based 2FA (Google Authenticator)
- Backup codes
- QR code generation

---

## Implementation Order

### Phase 1: Enhanced Share Functionality ✅
1. Create ShareMenu component with dropdown
2. Add platform share links (Twitter, Facebook, LinkedIn, WhatsApp, Reddit, Email)
3. Copy link with toast notification
4. **QR Code generation** for posts
5. Mobile Web Share API support

### Phase 2: Dark Mode Polish & Auth UX ✅
1. Fix dark mode on auth pages (background, text visibility)
2. Add password requirements validator with real-time checks
3. Add show/hide password toggle
4. **Remember Me** functionality (persistent login)
5. **Email Verification** - Send verification email on registration
6. **Forgot Password** - Complete password reset flow
7. Improve form validation and loading states

### Phase 3: OAuth Social Login ✅
1. Set up **Google OAuth** credentials
2. Set up **GitHub OAuth** credentials
3. Implement backend OAuth logic (CustomOAuth2UserService)
4. Create OAuth login buttons on LoginPage
5. Handle OAuth callback and JWT generation
6. Test both Google and GitHub OAuth flows
7. Auto-populate user profiles from OAuth data

---

## Files to Create/Modify

### New Files (Frontend)
- `/frontend/src/components/ShareMenu.tsx`
- `/frontend/src/components/PasswordRequirements.tsx`
- `/frontend/src/utils/shareUtils.ts`
- `/frontend/public/google-icon.svg`

### New Files (Backend)
- `/src/main/java/com/mehrdad/SafePost/security/CustomOAuth2UserService.java`
- `/src/main/java/com/mehrdad/SafePost/security/OAuth2SuccessHandler.java`
- `/src/main/resources/db/migration/V8__add_oauth_fields.sql`

### Files to Modify (Frontend)
- `/frontend/src/pages/LoginPage.tsx`
- `/frontend/src/pages/RegisterPage.tsx`
- `/frontend/src/pages/PostPage.tsx`
- `/frontend/src/App.tsx`
- `/frontend/src/App.css`

### Files to Modify (Backend)
- `/src/main/java/com/mehrdad/SafePost/config/SecurityConfig.java`
- `/src/main/java/com/mehrdad/SafePost/domain/entities/User.java`
- `/pom.xml`
- `/src/main/resources/application.properties`
- `/.env` (add OAuth credentials)

---

## Success Criteria

### Phase 1 Complete When:
- ✓ Share menu shows all platforms
- ✓ Copy link works with toast notification
- ✓ All share links open in new window
- ✓ Mobile Web Share API works on phones

### Phase 2 Complete When:
- ✓ Dark mode looks perfect on all auth pages
- ✓ Input text is visible in dark mode
- ✓ Password requirements show real-time validation
- ✓ Show/hide password toggle works
- ✓ All forms have proper validation

### Phase 3 Complete When:
- ✓ Users can log in with Google
- ✓ OAuth users are created in database
- ✓ Avatar from Google is saved
- ✓ JWT token is generated for OAuth users
- ✓ GitHub OAuth works (optional)

---

## Additional Ideas for Consideration

1. **Rate Limiting** - Prevent spam on auth endpoints
2. **Account Deletion** - Allow users to delete their accounts
3. **Profile Privacy** - Option to make profile private
4. **Email Verification** - Verify email addresses on registration
5. **Session Management** - View/revoke active sessions
6. **Activity Log** - Track user login history
7. **Avatar Upload** - Already done! ✓
8. **Markdown Preview** - Live preview when writing posts (already have editor)
9. **Post Templates** - Save and reuse post templates
10. **Draft Auto-Save** - Prevent data loss when writing

Let me know which features you'd like to prioritize!
