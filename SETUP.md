# Setup Instructions

This guide will help you set up the React Native Login Template in your project.

## 📋 Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Expo CLI installed globally: `npm install -g @expo/cli`
- Firebase account (free tier is sufficient)

## 🚀 Quick Start

### 1. Create New Project from Template

```bash
# Using npx (recommended)
npx create-expo-app MyApp --template react-native-login-template-ak

# Or using npm
npm create expo-app MyApp --template react-native-login-template-ak

# Or using yarn
yarn create expo-app MyApp --template react-native-login-template-ak
```

### 2. Navigate to Project

```bash
cd MyApp
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started" if it's your first time
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Enable "Email/Password" (first option)
6. Click "Save"

### Step 3: Get Configuration

1. In your Firebase project, click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Enter your app name (e.g., "MyApp Web")
6. Click "Register app"
7. Copy the configuration object

### Step 4: Configure Environment Variables

1. In your project root, copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Open `.env` and replace the placeholder values with your Firebase config:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

## 🛠 Development Setup

### Start Development Server

```bash
npm start
# or
yarn start
```

### Run on Different Platforms

```bash
# iOS Simulator (macOS only)
npm run ios

# Android Emulator
npm run android

# Web browser
npm run web
```

## 🔧 Customization

### 1. App Configuration

Edit `app.json` to customize your app:

```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### 2. Branding & Colors

Update colors in component stylesheets:

**Primary Colors:**
- Primary: `#007AFF` (iOS Blue)
- Secondary: `#F2F2F7` (Light Gray)
- Success: `#34C759` (Green)
- Warning: `#FF9500` (Orange)
- Error: `#FF3B30` (Red)

**Text Colors:**
- Primary Text: `#1D1D1F` (Dark)
- Secondary Text: `#8E8E93` (Gray)

### 3. App Icon & Splash Screen

Replace the default assets in `assets/images/`:
- `icon.png` (1024x1024) - App icon
- `splash-icon.png` (1284x2778) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon

## 📱 Project Structure Explained

```
src/
├── api/
│   └── firebase.js          # Firebase config & initialization
├── auth/
│   ├── AuthProvider.js      # Global auth state management
│   ├── authActions.js       # Login/register/logout functions
│   └── useAuth.js           # Custom hook for components
├── components/
│   ├── CustomButton.js      # Reusable button with variants
│   └── CustomInput.js       # Form input with validation
├── navigation/
│   ├── AppStack.js          # Screens for logged-in users
│   ├── AuthStack.js         # Login/register screens
│   └── RootNavigator.js     # Main navigation controller
├── screens/
│   ├── HomeScreen.js        # Main dashboard
│   ├── LoginScreen.js       # Login form
│   ├── ProfileScreen.js     # User profile
│   └── RegisterScreen.js    # Registration form
├── utils/
│   ├── delay.js             # Rate limiting logic
│   └── storage.js           # Secure token storage
└── App.js                   # Root component
```

## 🔒 Security Configuration

### Rate Limiting

Adjust rate limiting settings in `src/utils/delay.js`:

```javascript
const RATE_LIMIT_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,        // Max failed login attempts
  MAX_REGISTER_ATTEMPTS: 3,     // Max failed register attempts
  LOGIN_COOLDOWN_MINUTES: 15,   // Cooldown after max attempts
  REGISTER_COOLDOWN_MINUTES: 5, // Cooldown after max attempts
  BASE_DELAY_MS: 1000,          // Initial delay between attempts
  MAX_DELAY_MS: 10000,          // Maximum delay (exponential backoff)
};
```

### Storage Security

The template automatically uses:
- **Expo SecureStore** on mobile (encrypted keychain/keystore)
- **AsyncStorage** on web (fallback for development)

## 🚀 Building for Production

### 1. EAS Build (Recommended)

Install EAS CLI:
```bash
npm install -g eas-cli
```

Configure EAS:
```bash
eas build:configure
```

Build for all platforms:
```bash
eas build --platform all
```

### 2. Expo Build (Legacy)

```bash
# iOS
expo build:ios

# Android
expo build:android
```

## 🔧 Troubleshooting

### Common Issues

1. **Firebase not initialized:**
   - Check that `.env` file exists and has correct values
   - Ensure all Firebase config variables start with `EXPO_PUBLIC_`

2. **Navigation not working:**
   - Make sure all dependencies are installed
   - Check that navigation imports are correct

3. **Authentication errors:**
   - Verify Firebase Authentication is enabled
   - Check that Email/Password sign-in method is enabled

4. **Rate limiting too strict:**
   - Adjust values in `src/utils/delay.js`
   - Clear AsyncStorage during development: `expo r --clear`

### Getting Help

1. Check the [GitHub Issues](https://github.com/your-username/react-native-login-template-ak/issues)
2. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Device/platform information
   - Firebase configuration (without sensitive data)

## 📚 Next Steps

After setup:

1. **Customize the UI** to match your brand
2. **Add additional screens** for your app's features
3. **Configure Firebase rules** for your database
4. **Set up analytics** if needed
5. **Add error reporting** (e.g., Sentry)
6. **Write tests** for your authentication flow

## 🎉 You're Ready!

Your React Native Login Template is now set up and ready for development. Happy coding!

---

Need more help? Check the [README.md](./README.md) for additional documentation and examples. 