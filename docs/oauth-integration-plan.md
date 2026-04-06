# Google & Facebook OAuth Integration Plan

## Two Integration Methods


### Method: Mobile App Token Exchange Flow (Recommended for Mobile)
Mobile apps use native SDKs to get tokens, then exchange them with your backend.

---

## Required Credentials

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth client ID**
5. Configure OAuth consent screen (if not done)
6. Select **Web application** for web OR **Android/iOS** for mobile
7. For mobile: Add package name and SHA-1 certificate fingerprint
8. Get credentials:
   - **Client ID**: `your-google-client-id.apps.googleusercontent.com`
   - **Client Secret**: `your-google-client-secret`

### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (type: Authentication)
3. Navigate to **Settings > Basic** to get:
   - **App ID**: `your-facebook-app-id`
   - **App Secret**: `your-facebook-app-secret**
4. Navigate to **Products > Facebook Login > Settings**
5. Add valid OAuth redirect URIs (web) or configure native app settings
6. Get credentials from **Settings > Basic**

## Environment Variables

Add these to your `.env` file:

```env
# JWT Secrets
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/v1/auth/facebook/callback

# Frontend URL (for web redirect)
FRONTEND_URL=http://localhost:3000
```

---

## API Endpoints

### For Mobile Apps (Token Exchange Flow)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/google-login` | Exchange Google idToken for JWT |
| POST | `/api/v1/auth/facebook-login` | Exchange Facebook accessToken for JWT |

### For Web Apps (Redirect Flow)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/auth/google` | Redirect to Google OAuth |
| GET | `/api/v1/auth/google/callback` | Handle Google callback |
| GET | `/api/v1/auth/facebook` | Redirect to Facebook OAuth |
| GET | `/api/v1/auth/facebook/callback` | Handle Facebook callback |

---

## Implementation Guide

### Step 1: Install Dependencies

```bash
npm install google-auth-library axios jsonwebtoken
npm install --save-dev @types/jsonwebtoken
# For web OAuth (optional)
npm install passport passport-google-oauth20 passport-facebook
```

### Step 2: Update User Model

**File:** `src/app/v1/modules/user/user.interface.ts`

Add to `TUser` interface:

```typescript
google_id?: string;
facebook_id?: string;
auth_provider: 'email' | 'google' | 'facebook';
```

**File:** `src/app/v1/modules/user/user.model.ts`

Add to schema:

```typescript
google_id: { type: String },
facebook_id: { type: String },
auth_provider: { 
  type: String, 
  enum: ['email', 'google', 'facebook'], 
  default: 'email' 
},
```

### Step 3: Create Auth Service

**File:** `src/app/v1/modules/auth/auth.services.ts`

Add this service function:

```typescript
const socialLoginIntoDB = async (payload: {
  email: string;
  full_name: string;
  profile_picture?: string;
  google_id?: string;
  facebook_id?: string;
  auth_provider: 'google' | 'facebook';
}) => {
  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      ...payload,
      is_verified: true,
      is_profile_completed: true,
      status: 'ACTIVE',
      role: 'CUSTOMER',
      password: Math.random().toString(36).slice(-10),
    });
  } else {
    const idField = payload.auth_provider === 'google' ? 'google_id' : 'facebook_id';
    if (!user[idField]) {
      user[idField] = payload.google_id || payload.facebook_id;
      user.auth_provider = payload.auth_provider;
      await user.save();
    }
  }

  const jwtPayload = { user_id: user._id.toString(), role: user.role };
  
  const accessToken = createToken(
    jwtPayload, 
    configs.jwt_access_token as string, 
    configs.jwt_access_expiresIn as string
  );
  
  const refreshToken = createToken(
    jwtPayload, 
    configs.jwt_refresh_token as string, 
    configs.jwt_refresh_expiresIn as string
  );

  return { user, accessToken, refreshToken };
};
```

### Step 4: Create Auth Controller

**File:** `src/app/v1/modules/auth/auth.controller.ts`

```typescript
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const googleClient = new OAuth2Client(configs.GOOGLE_CLIENT_ID);

const googleMobileLogin = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: configs.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: "Invalid Google token" });
    }

    const result = await AuthServices.socialLoginIntoDB({
      email: payload.email,
      full_name: payload.name || 'Google User',
      profile_picture: payload.picture,
      google_id: payload.sub,
      auth_provider: 'google',
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const facebookMobileLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    const { data: profile } = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!profile.email) {
      return res.status(400).json({ success: false, message: "Email not provided by Facebook" });
    }

    const result = await AuthServices.socialLoginIntoDB({
      email: profile.email,
      full_name: profile.name,
      profile_picture: profile.picture?.data?.url,
      facebook_id: profile.id,
      auth_provider: 'facebook',
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

### Step 5: Add Routes

**File:** `src/app/v1/modules/auth/auth.route.ts`

```typescript
// Mobile App Endpoints (Token Exchange)
router.post('/google-login', AuthControllers.googleMobileLogin);
router.post('/facebook-login', AuthControllers.facebookMobileLogin);

// Web OAuth Endpoints (Redirect Flow)
router.get('/google', AuthControllers.googleAuthRedirect);
router.get('/google/callback', AuthControllers.googleAuthCallback);
router.get('/facebook', AuthControllers.facebookAuthRedirect);
router.get('/facebook/callback', AuthControllers.facebookAuthCallback);
```

---

## How It Works

### Mobile App Flow (Token Exchange)

**Google:**
1. Mobile App uses `react-native-google-signin` or `google_sign_in` (Flutter)
2. User signs in → SDK returns `idToken`
3. App sends POST to `/api/v1/auth/google-login` with:
   ```json
   { "idToken": "THE_TOKEN_FROM_GOOGLE_SDK" }
   ```
4. Server verifies token with Google, returns your JWT

**Facebook:**
1. Mobile App uses `react-native-fbsdk-next` or `flutter_facebook_auth`
2. User signs in → SDK returns `accessToken`
3. App sends POST to `/api/v1/auth/facebook-login` with:
   ```json
   { "accessToken": "THE_TOKEN_FROM_FACEBOOK_SDK" }
   ```
4. Server verifies token with Facebook Graph API, returns your JWT

### Web Flow (Redirect)

1. User clicks "Login with Google/Facebook"
2. Server redirects to OAuth provider
3. User authorizes on provider's page
4. Provider redirects to your callback URL with auth code
5. Server exchanges code for tokens, creates/finds user
6. Server redirects to frontend with JWT tokens in URL

---

## Frontend Integration

### Mobile App

```javascript
// React Native - Google
import { GoogleSignin } from '@react-native-google-signin/google-signin';

await GoogleSignin.signIn();
const { idToken } = await GoogleSignin.getTokens();

// Send to backend
fetch('https://your-api.com/api/v1/auth/google-login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ idToken })
}).then(res => res.json())
  .then(data => {
    // Save tokens and navigate to dashboard
    AsyncStorage.setItem('accessToken', data.data.accessToken);
  });
```

```javascript
// React Native - Facebook
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

LoginManager.logInWithPermissions(['email']).then(result => {
  if (result.isCancelled) return;
  return AccessToken.getCurrentAccessToken();
}).then(accessToken => {
  // Send to backend
  fetch('https://your-api.com/api/v1/auth/facebook-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accessToken })
  });
});
```

### Web App

```javascript
// Login buttons redirect to OAuth endpoints
const googleLogin = () => {
  window.location.href = 'https://your-api.com/api/v1/auth/google';
};

const facebookLogin = () => {
  window.location.href = 'https://your-api.com/api/v1/auth/facebook';
};

// Handle callback
const handleCallback = () => {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get('accessToken');
  const refreshToken = params.get('refreshToken');
  
  if (accessToken && refreshToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    window.location.href = '/dashboard';
  }
};
```

---

## Security Considerations

1. **Token Validation**: Always validate OAuth tokens server-side
2. **State Parameter**: Use CSRF state parameter for web OAuth
3. **Token Storage**: Use httpOnly cookies (recommended) or secure storage for mobile
4. **Scope Minimization**: Request only necessary scopes
5. **Redirect URIs**: Whitelist exact redirect URIs in OAuth consoles
6. **Client Secret**: Keep secrets secure, never expose in frontend code
