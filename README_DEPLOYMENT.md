# SafePost Deployment Guide

## Railway Deployment

### Prerequisites
- Railway account (sign up at https://railway.app)
- GitHub repository connected

### Services to Deploy
1. **PostgreSQL Database**
2. **Backend (Spring Boot)**
3. **Frontend (React + Nginx)**

### Environment Variables Needed

#### Backend Service:
```
DATABASE_URL=jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DATABASE_USERNAME=${{Postgres.PGUSER}}
DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
JWT_SECRET=your-random-secret-at-least-32-chars
CORS_ALLOWED_ORIGINS=${{Frontend.RAILWAY_PUBLIC_DOMAIN}}
DDL_AUTO=update
SHOW_SQL=false
```

#### Frontend Service:
```
VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}
```

### Deployment Steps

1. **Create New Project** in Railway
2. **Add PostgreSQL** from database templates
3. **Deploy Backend**:
   - Connect GitHub repository
   - Select root directory
   - Railway will detect Dockerfile automatically
   - Add environment variables
4. **Deploy Frontend**:
   - Add new service from same repo
   - Set root directory to `/frontend`
   - Railway will detect Dockerfile automatically
   - Add environment variable for API URL
5. **Configure Domains**:
   - Backend and Frontend will get auto-generated URLs
   - Update CORS settings with frontend URL

### Post-Deployment

- Database migrations run automatically on backend startup
- Check logs for any errors
- Test all features (login, posts, file uploads)

### Monitoring

- View logs in Railway dashboard
- Check service health
- Monitor database usage

### Estimated Costs

Railway offers:
- **Free Tier**: $5/month credit (hobby plan)
- **Pro Plan**: $20/month for production apps

Your app should run fine on the free tier for testing!
