# WebKMT - Premium Digital Solutions Platform

**Professional business automation and marketing agency platform targeting GCC countries**

A sophisticated, production-ready platform showcasing WebKMT's expertise in software solutions, business automation, and digital marketing. Features elegant glassmorphism design, comprehensive lead generation tools, and advanced user engagement systems.

---

## 🌟 Platform Overview

WebKMT is a comprehensive digital platform designed to:
- **Showcase Services**: Elegant presentation of software development, automation, and marketing services
- **Generate Leads**: Interactive mini-apps and tools that capture qualified prospects
- **Engage Users**: AI-powered chatbot and dynamic content management
- **Serve GCC Markets**: Full Arabic/English localization with RTL support
- **Demonstrate Expertise**: Live examples of technical capabilities and design excellence

**Current Status**:
- **Environment**: Running on localhost:8083 (12 background servers causing conflicts - needs cleanup)
- **Production Domain**: webkmt.com:8083 (SSL configured)
- **Critical Issue**: Firebase authentication working but permission errors with info@webkmt.com admin account

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Vanilla JavaScript with modular ES6+ architecture
- **Styling**: Advanced CSS3 with glassmorphism effects, responsive design
- **Internationalization**: Complete Arabic/English localization with RTL support
- **Performance**: Lazy loading, code splitting, Progressive Web App features
- **Security**: Content Security Policy, XSS protection, secure authentication

### Backend
- **Server**: Node.js + Express.js with production middleware
- **Database**: Firebase Firestore with real-time capabilities
- **Authentication**: Firebase Auth with role-based access control
- **AI Integration**: Google Gemini 1.5 Flash for intelligent chatbot
- **Security**: Helmet.js, rate limiting, CORS, input validation
- **Performance**: Compression, caching, CDN optimization

### Mini-Apps Ecosystem
Advanced iframe-based sandbox system for secure tool deployment:
- **KMT Link Builder**: Bio-link page generator with analytics
- **Website Analyzer**: Comprehensive SEO and performance auditing
- **ROI Calculator**: Business investment return analysis
- **Color Palette Tool**: Brand color scheme generator
- **Speed Tester**: Website performance benchmarking
- **Social Scheduler**: Social media management tool

---

## 🚀 Quick Start

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/webkmt/website.git
cd web-kemet

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your API keys and configuration

# Start development server
npm start
```

The application will be available at `http://localhost:8083`

### Environment Configuration

Create a `.env` file with the following required variables:

```bash
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# AI Integration
GEMINI_API_KEY=your_gemini_api_key

# Security
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Server
NODE_ENV=development
PORT=8083
DOMAIN=localhost
```

---

## 📁 Project Structure

```
web-kemet/
├── index.html              # Main application entry point
├── css/                    # Modular stylesheet architecture
│   ├── main-bundle.css     # Core styling bundle
│   ├── components-bundle.css # Component-specific styles
│   ├── portfolio-bundle.css # Portfolio section styles
│   ├── forms-auth-bundle.css # Forms and authentication styles
│   └── responsive-fixes.css # Mobile responsiveness fixes
├── js/                     # JavaScript modules
│   ├── main.js             # Application initialization
│   ├── firebase-config.js  # Firebase configuration & setup
│   ├── auth-ui.js          # Authentication UI components
│   ├── blog-manager.js     # Admin blog management
│   ├── chatbot.js          # AI chatbot implementation
│   ├── mini-apps-manager.js # Mini-apps container system
│   ├── ui-enhancements.js  # UI enhancement bundle
│   ├── performance-utils.js # Performance utilities
│   ├── shared/             # Shared utilities and services
│   └── modules/            # Feature-specific modules
├── mini-apps/              # Standalone tool applications
│   ├── kmtlink-simple.html # Link building tool
│   ├── kmtlink-public-profile.html # Public profile pages
│   ├── website-analyzer.html # SEO analysis tool
│   ├── roi-calculator.html # ROI calculation tool
│   └── color-palette.html  # Color scheme generator
├── server/                 # Backend API server
│   ├── app.js              # Express.js application
│   ├── routes/             # API endpoint definitions
│   ├── middleware/         # Security and utility middleware
│   └── config/             # Server configuration files
├── locales/                # Internationalization files
│   ├── en.json             # English translations
│   └── ar.json             # Arabic translations
├── assets/                 # Static resources and media
├── firestore.rules         # Firebase security rules
├── ecosystem.config.js     # PM2 process configuration
└── package.json            # Project dependencies
```

---

## 🔐 Firebase Setup

### 1. Create Firebase Project
1. Visit [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing `webkmt-40b44`
3. Enable Authentication, Firestore, and Storage

### 2. Configure Authentication
1. Go to Authentication → Sign-in method
2. Enable:
   - Email/Password
   - Google (optional)
   - GitHub (optional)
3. Add authorized domains: `localhost`, `webkmt.com`

### 3. Create Admin Account
1. Navigate to your website
2. Click "Sign In" button
3. Register with email: `info@webkmt.com`
4. System automatically assigns admin role
5. Verify admin access in user dropdown menu

### 4. Deploy Security Rules
```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules
```

**Important**: The project currently has **Firebase permission errors** with the admin account. Authentication works but data access may be restricted.

---

## 🌐 Deployment

### Production Requirements
- **Node.js**: 16.x or higher
- **Process Manager**: PM2
- **Web Server**: Apache/Nginx with SSL
- **Database**: Firebase Firestore
- **AI Service**: Google Gemini API access

### CloudPanel Deployment

```bash
# 1. Upload project files to server
# Destination: /home/webkmt/htdocs/webkmt.com/

# 2. Install production dependencies
cd /home/webkmt/htdocs/webkmt.com
npm install --production

# 3. Set file permissions
chmod 600 .env
chmod 755 logs/

# 4. Start with PM2
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

### Domain Configuration
- **Main Domain**: https://webkmt.com (port 8083)
- **Bio-Link Subdomain**: https://link.webkmt.com/{username}
- **SSL**: Certificate covering both domains required

### Nginx Configuration (CloudPanel)
```nginx
server {
    server_name webkmt.com www.webkmt.com;
    location / {
        proxy_pass http://localhost:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    server_name link.webkmt.com;
    location / {
        proxy_pass http://localhost:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🎯 Core Features

### 1. Authentication & Access Control
- **Account-Gated Mini-Apps**: Secure access to premium tools
- **Dual User Types**: Regular users (free plan) + Admin (info@webkmt.com only)
- **Role-Based Access**: Firestore security rules enforce permissions
- **Social Login**: Email/Password, Google, GitHub OAuth

### 2. AI-Powered Chatbot
- **Google Gemini Integration**: Intelligent conversational AI
- **Business Context**: Pre-trained with WebKMT service information
- **Multi-Language**: Supports English and Arabic
- **Lead Qualification**: Automated initial screening

### 3. Lead Generation Tools
- **Newsletter Subscription**: Email collection to Firebase
- **Contact Form**: Direct inquiry submission
- **Mini-Apps**: Value-first approach with data capture
- **Analytics Integration**: Track conversion points

### 4. Portfolio & Showcase
- **Interactive Portfolio**: Expandable project cards
- **Enhanced Modals**: Detailed project information with galleries
- **Category Filtering**: Websites, Branding, Automation, Mobile Apps
- **Client Testimonials**: Social proof and case studies

### 5. Admin Blog Management
- **Rich Text Editor**: Full content management system
- **Draft System**: Save and publish workflow
- **SEO Management**: Meta tags, slugs, descriptions
- **Admin-Only Access**: Restricted to info@webkmt.com

### 6. Internationalization
- **Complete Arabic/English Support**: Full feature parity
- **RTL Layout**: Proper right-to-left rendering
- **Cultural Adaptation**: GCC-specific colors and formatting
- **Dynamic Switching**: No page reload required

### 7. Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Mobile Collapse System**: Smart content organization
- **Touch-Optimized**: 44px minimum touch targets
- **Progressive Enhancement**: Works without JavaScript

---

## 🛠️ Mini-Applications

### KMT Link Builder
**Purpose**: Create custom bio-link pages (like Linktree)

**Features**:
- Custom profile pages with unique URLs
- Multiple link management
- Analytics and click tracking
- Customizable themes and branding

**Access**: `https://link.webkmt.com/{username}`

**Status**: ⚠️ Authentication inheritance needs testing

### Website Analyzer
**Purpose**: Comprehensive SEO and performance auditing

**Features**:
- Technical SEO analysis
- Performance metrics
- Mobile-friendliness check
- Accessibility scoring

**API**: Apify + PageSpeed API (server-side)

### ROI Calculator
**Purpose**: Business investment return analysis

**Features**:
- Financial projections
- Comparison tools
- PDF report generation
- Custom metrics

### Color Palette Generator
**Purpose**: Brand color scheme creation

**Features**:
- AI-suggested palettes
- Accessibility contrast testing
- Export options (CSS, JSON, image)
- Color theory algorithms

### Speed Tester
**Purpose**: Website performance benchmarking

**Features**:
- Core Web Vitals measurement
- Lighthouse scoring
- Performance recommendations
- Historical tracking

**API**: PageSpeed API (server-side)

---

## 🔒 Security Features

### Client-Side Security
- **Content Security Policy (CSP)**: Strict XSS protection
- **Input Validation**: All forms sanitized
- **Firebase App Check**: reCAPTCHA v3 integration
- **Secure Authentication**: Token-based sessions

### Server-Side Security
- **Helmet.js**: Security headers (HSTS, CSP, X-Frame-Options)
- **Rate Limiting**:
  - General API: 100 requests / 15 minutes
  - Auth endpoints: 5 requests / 15 minutes
- **CORS Configuration**: Domain whitelisting
- **API Proxy Pattern**: Sensitive keys never exposed

### Firebase Security
```javascript
// Firestore Rules Highlights
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Admin-only blog management
    match /blogs/{blogId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth.token.email == 'info@webkmt.com';
    }

    // Public submissions, admin reads
    match /contacts/{contactId} {
      allow create: if true;
      allow read: if request.auth.token.email == 'info@webkmt.com';
    }
  }
}
```

---

## 🐛 Known Issues & Troubleshooting

### Current Critical Issues

**1. Firebase Permission Errors with Admin Account** (ACTIVE ISSUE)
- **Symptom**: Admin user (info@webkmt.com) gets permission errors
- **Status**: Authentication works, but Firestore access restricted
- **Workaround**: Check Firestore rules and custom claims
- **Debug**:
  ```javascript
  // Run in browser console
  const user = firebase.auth().currentUser;
  user.getIdTokenResult().then(token => {
    console.log('Custom claims:', token.claims);
  });
  ```

**2. Multiple Background Servers** (ACTIVE ISSUE)
- **Symptom**: 12 servers running on localhost:8083 causing conflicts
- **Solution**: Clean up processes before starting new server
  ```bash
  # Kill all node processes
  pkill -f "node server/app.js"

  # Check port usage
  lsof -i :8083

  # Start fresh
  npm start
  ```

**3. Admin Blog Button Not Showing**
- **Status**: Fixed with auth state listener
- **Solution Applied**: BlogManager now listens for login events
- **Verify**: Check console for admin verification logs

**4. Mini-Apps Authentication Inheritance**
- **Status**: Debugging enhanced with comprehensive logging
- **Expected**: Auto-login when parent page authenticated
- **Test**: Open KMT Link while logged in, check console logs

### Troubleshooting Guide

**If authentication fails:**
1. Check browser console for specific errors
2. Verify Firebase App Check is disabled for development
3. Clear browser cache and cookies
4. Check authorized domains in Firebase Console
5. Verify .env file has correct API keys

**If admin features don't appear:**
1. Confirm logged in as info@webkmt.com (exact match)
2. Check Firestore `users` collection for role="admin"
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Check console for admin verification errors

**If mini-apps require separate login:**
1. Check console for postMessage communication
2. Verify authManager is initialized: `console.log(window.authManager)`
3. Check iframe sandbox permissions
4. Test parent auth state: `window.authManager.isLoggedIn()`

**If server won't start:**
```bash
# Check if port is in use
lsof -i :8083

# Kill process using port
kill -9 <PID>

# Or kill all node processes
pkill -f "node"

# Restart
npm start
```

---

## 📊 Testing Checklist

### Pre-Deployment Testing

**Authentication**:
- [ ] Register new user account
- [ ] Login with email/password
- [ ] Login as admin (info@webkmt.com)
- [ ] Verify admin button appears in dropdown
- [ ] Test logout functionality
- [ ] Test Google OAuth (if enabled)
- [ ] Test GitHub OAuth (if enabled)

**Firebase Data Persistence**:
- [ ] Submit contact form
- [ ] Subscribe to newsletter
- [ ] Create blog post as admin
- [ ] Edit existing blog post
- [ ] Delete blog post
- [ ] Verify data in Firebase Console

**Mini-Apps**:
- [ ] Access KMT Link Builder while logged in
- [ ] Verify auto-login (no separate auth required)
- [ ] Create bio-link profile
- [ ] Test profile URL: link.webkmt.com/{username}
- [ ] Test Website Analyzer
- [ ] Test ROI Calculator
- [ ] Test Color Palette Generator
- [ ] Test Speed Tester

**Responsive Design**:
- [ ] Test on mobile (320px to 768px)
- [ ] Test on tablet (768px to 1024px)
- [ ] Test on desktop (1024px+)
- [ ] Verify mobile collapse system works
- [ ] Test hamburger menu functionality
- [ ] Verify chatbot sizing on mobile

**Internationalization**:
- [ ] Switch to Arabic
- [ ] Verify RTL layout
- [ ] Check all translated content
- [ ] Switch back to English
- [ ] Verify preference persistence

**Performance**:
- [ ] Run Lighthouse audit (target: 90+ performance)
- [ ] Check Core Web Vitals
- [ ] Test page load time (<3 seconds)
- [ ] Verify lazy loading works
- [ ] Check browser console for errors

---

## 🔧 Performance Optimization

### Current Performance Targets
- **Lighthouse Performance**: 90+ (currently ~75 estimate)
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Total Blocking Time**: <200ms
- **Cumulative Layout Shift**: <0.1

### Optimization Strategies

**CSS Optimization**:
- Bundle consolidation (currently 15 CSS files → target 3-5)
- Remove 400+ duplicate classes
- Implement PostCSS + PurgeCSS build process
- Minification for production

**JavaScript Optimization**:
- Code splitting by route
- Lazy load non-critical features
- Reduce global namespace pollution
- Consolidate initialization (currently 18+ DOMContentLoaded listeners)

**Image Optimization**:
- Convert to WebP format with JPEG fallbacks
- Responsive images with srcset
- Lazy loading (already implemented)
- Compress all images for web delivery

**Caching Strategy**:
- Long-term cache for static assets
- Service worker for offline functionality
- CDN integration for global delivery

---

## 📞 Support & Maintenance

### Production Monitoring

**Application Logs**:
- **Access**: CloudPanel → Logs → Access Log
- **Errors**: CloudPanel → Logs → Error Log
- **App Logs**: `/home/webkmt/htdocs/webkmt.com/logs/`

**PM2 Monitoring**:
```bash
# Check status
pm2 status

# View logs
pm2 logs webkmt

# Monitor resources
pm2 monit

# Restart application
pm2 restart webkmt

# Stop application
pm2 stop webkmt
```

### Firebase Console Quick Links
- **Authentication Users**: https://console.firebase.google.com/project/webkmt-40b44/authentication/users
- **Firestore Database**: https://console.firebase.google.com/project/webkmt-40b44/firestore/data
- **App Check**: https://console.firebase.google.com/project/webkmt-40b44/appcheck
- **Project Settings**: https://console.firebase.google.com/project/webkmt-40b44/settings/general

### Emergency Procedures

**If site is down:**
```bash
# Check server status
pm2 status webkmt

# Check logs for errors
pm2 logs webkmt --lines 100

# Restart server
pm2 restart webkmt

# If restart fails, hard restart
pm2 delete webkmt
pm2 start ecosystem.config.js --env production
```

**If Firebase connection fails:**
1. Check Firebase Console for service outages
2. Verify API keys in .env file
3. Check network requests in browser DevTools
4. Verify authorized domains in Firebase settings

---

## 🤝 Contributing

This is a proprietary project for WebKMT. For technical support or feature requests, contact the development team.

### Development Guidelines
- Follow ES6+ JavaScript standards
- Maintain responsive design principles
- Ensure cross-browser compatibility (Chrome 90+, Safari 14+, Firefox 88+)
- Implement proper error handling
- Write comprehensive documentation
- Test on multiple devices and screen sizes

---

## 📄 License

Copyright © 2025 WebKMT. All rights reserved.

**WebKMT** - Communicating Excellence Through Digital Innovation

*Built with precision for the GCC market | Powered by cutting-edge technology*
