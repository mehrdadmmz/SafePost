# DevVault Pivot Plan 🚀

## Overview
Transform SafePost (generic blog) → DevVault (developer knowledge platform)

---

## Phase 1: Branding & Terminology (30 min)

### 1.1 Name Changes
- **App Name**: SafePost → DevVault
- **Tagline**: "Your vault of developer knowledge"
- **Description**: Platform for developers to share solutions, tutorials, and technical insights

### 1.2 Terminology Mapping
| Old Term | New Term | Why |
|----------|----------|-----|
| Post | Article | More professional, broader content types |
| Blog Posts | Knowledge Base | Emphasizes learning/reference |
| New Post | Share Knowledge | Action-oriented, collaborative |
| Draft Posts | My Drafts | Cleaner, simpler |
| Author | Contributor | Collaborative spirit |
| Categories | Topics | Better for technical content |

### 1.3 Files to Update
**Frontend:**
- `/frontend/src/pages/HomePage.tsx` - "Blog Posts" → "Knowledge Base"
- `/frontend/src/pages/EditPostPage.tsx` - "New Post" → "Share Knowledge"
- `/frontend/src/components/NavBar.tsx` - "Safe Post 📭" → "DevVault 🔐"
- `/frontend/index.html` - Page title
- `/frontend/package.json` - Project name

**Backend:**
- `/src/main/resources/application.properties` - spring.application.name
- `/pom.xml` - Project name and description
- All comments/documentation

**Root:**
- `/README.md` - Complete rewrite with DevVault branding
- `/docker-compose.yml` - Service names and descriptions

---

## Phase 2: Visual Identity (20 min)

### 2.1 Font Selection
**Primary Font**: **JetBrains Mono** (or Space Mono as alternative)
- Why: Clean, modern, developer-focused, highly readable
- Where: Headers, navigation, code blocks
- Backup: Space Mono (more playful) or Fira Code

**Implementation:**
- Add Google Fonts import to `index.html`
- Update CSS with font-family variables
- Apply to headings and navigation

### 2.2 Color Tweaks (Optional)
- Keep existing NextUI theme
- Consider adding tech-themed accent colors (terminal green, code editor blues)

### 2.3 Logo/Emoji
- Current: 📭 (mailbox)
- New: 🔐 (locked with key - represents vault/security)
- Alternative: 💾 (floppy disk - nostalgia + storage)
- Alternative: 🗄️ (file cabinet - organized knowledge)

---

## Phase 3: README Overhaul (20 min)

### 3.1 New README Structure
```markdown
# DevVault 🔐
> Your vault of developer knowledge

[Brief description]
[Screenshot placeholder]
[Tech stack badges]

## Why DevVault?
- Problem statement
- Solution approach

## Features
- Syntax-highlighted code blocks
- Full-text search
- Community-driven (likes)
- User profiles

## Tech Stack
- Backend: Spring Boot 3.5, PostgreSQL
- Frontend: React 18, TypeScript, NextUI
- Infrastructure: Docker, Railway-ready

## Getting Started
[Local development setup]

## Architecture
[Brief architecture overview]

## Contributing
[Future: How to contribute]

## License
[MIT or choose appropriate]
```

---

## Phase 4: UI Text Updates (15 min)

### 4.1 Key UI Text Changes
**HomePage:**
- Title: "Knowledge Base" (was "Blog Posts")
- Search placeholder: "Search articles by title, code, or author..."
- Empty state: "No articles yet. Share your knowledge!"

**NavBar:**
- Logo: "DevVault 🔐"
- Button: "Share Knowledge" (was "New Post")
- Menu item: "My Articles" (was "My Drafts")

**PostPage/ArticlePage:**
- Author label: "Contributed by"
- Share text: "Share this article"

**EditPostPage:**
- Title: "Share Your Knowledge" (create mode)
- Title: "Edit Article" (edit mode)
- Publish button: "Publish Article"

---

## Phase 5: Final Polish (10 min)

### 5.1 Consistency Check
- [ ] All "post" references changed to "article"
- [ ] All "SafePost" changed to "DevVault"
- [ ] Font applied consistently
- [ ] New emoji/logo everywhere

### 5.2 Quick Test
- [ ] Create new article
- [ ] Search functionality
- [ ] Navigation works
- [ ] Branding looks good

---

## Implementation Order

1. **Start with branding** (visible impact, motivating)
   - NavBar logo and name
   - Font implementation
   - Page titles

2. **Update terminology** (bulk find/replace)
   - Frontend text strings
   - Component names (optional, can do later)
   - Comments and documentation

3. **Rewrite README** (clear project identity)
   - New description
   - Updated tech focus
   - Developer-centric messaging

4. **Test everything** (ensure nothing broke)
   - Basic functionality
   - Visual consistency
   - No broken references

---

## Estimated Time: ~1.5 hours

## Success Criteria
✅ No references to "SafePost" or "blog" in user-facing text
✅ New developer-focused font applied
✅ README clearly positions DevVault as developer knowledge platform
✅ All features still work
✅ Looks cohesive and professional

---

## Post-Pivot (Future Tasks - Not Today)
- [ ] Add code snippet templates
- [ ] "Bookmark" feature for saving articles
- [ ] Series/tutorial chains
- [ ] Resume-ready documentation
- [ ] Deployment to Railway

---

Ready to start? Let's tackle this phase by phase! 🚀
