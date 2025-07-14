# React Native Login Template

A comprehensive React Native authentication template with Firebase, featuring modern UI components, secure token management, and rate limiting.

## 🚀 Features

- **🔐 Firebase Authentication** - Complete email/password authentication
- **📱 Modern UI** - Beautiful, accessible components with dark mode support
- **🔄 JWT Token Management** - Automatic token refresh and secure storage
- **💾 Secure Storage** - Cross-platform secure storage with AsyncStorage fallback
- **🚦 Rate Limiting** - Built-in rate limiting with exponential backoff
- **📡 Context API** - Global state management for authentication
- **🧭 React Navigation** - Smooth navigation between auth and app flows
- **✨ TypeScript Ready** - Fully typed for better development experience
- **🎨 Customizable** - Easy to customize colors, fonts, and layouts

## 📁 Project Structure

```
src/
├── api/
│   └── firebase.js          # Firebase configuration and initialization
├── auth/
│   ├── AuthProvider.js      # Context provider for authentication state
│   ├── authActions.js       # Authentication actions (login, register, logout)
│   └── useAuth.js           # Custom hook for auth operations
├── components/
│   ├── CustomButton.js      # Reusable button component
│   └── CustomInput.js       # Reusable input component with validation
├── navigation/
│   ├── AppStack.js          # Navigation for authenticated users
│   ├── AuthStack.js         # Navigation for unauthenticated users
│   └── RootNavigator.js     # Main navigation controller
├── screens/
│   ├── HomeScreen.js        # Main app screen
│   ├── LoginScreen.js       # Login form
│   ├── ProfileScreen.js     # User profile and settings
│   └── RegisterScreen.js    # Registration form
├── utils/
│   ├── delay.js             # Rate limiting utilities
│   └── storage.js           # Secure storage utilities
└── App.js                   # Main app component
```

## 🛠 Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Firebase Setup

1. Create a new project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password
3. Get your configuration from Project Settings
4. Copy `env.example` to `.env`
5. Fill in your Firebase configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run the App

```bash
npm start
# or
yarn start
```

## 🔧 Configuration

### Rate Limiting

Configure rate limiting in `src/utils/delay.js`:

```javascript
const RATE_LIMIT_CONFIG = {
  MAX_LOGIN_ATTEMPTS: 5,
  MAX_REGISTER_ATTEMPTS: 3,
  LOGIN_COOLDOWN_MINUTES: 15,
  REGISTER_COOLDOWN_MINUTES: 5,
  BASE_DELAY_MS: 1000,
  MAX_DELAY_MS: 10000,
};
```

### UI Customization

Colors and styling can be customized in each component's StyleSheet. Common colors used:

- Primary: `#007AFF`
- Secondary: `#F2F2F7`
- Success: `#34C759`
- Warning: `#FF9500`
- Error: `#FF3B30`
- Text: `#1D1D1F`
- Secondary Text: `#8E8E93`

## 📱 Usage

### Authentication Hook

```javascript
import { useAuth } from './src/auth/useAuth';

const MyComponent = () => {
  const {
    // State
    isAuthenticated,
    user,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    resetPassword,
    clearError,
    
    // Computed values
    userEmail,
    userId,
    userDisplayName,
    isEmailVerified,
  } = useAuth();

  return (
    // Your component JSX
  );
};
```

### Custom Components

#### CustomButton

```javascript
import CustomButton from './src/components/CustomButton';

<CustomButton
  title="Sign In"
  onPress={handleLogin}
  loading={isLoading}
  variant="primary" // primary, secondary, outline, text
  size="medium"     // small, medium, large
/>
```

#### CustomInput

```javascript
import CustomInput from './src/components/CustomInput';

<CustomInput
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  error={emailError}
  required
/>
```

## 🔒 Security Features

- **Secure Storage**: Uses Expo SecureStore on mobile, AsyncStorage on web
- **Token Management**: Automatic JWT refresh and secure storage
- **Rate Limiting**: Prevents brute force attacks with exponential backoff
- **Input Validation**: Client-side validation for forms
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🚀 Deployment

### Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Or use EAS Build (recommended)
eas build --platform all
```

### Environment Variables

Make sure to set up environment variables in your deployment platform:
- Vercel: Add to project settings
- Netlify: Add to build environment
- EAS: Use `eas secret:create`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you have any questions or run into issues:

1. Check the [Issues](https://github.com/your-username/react-native-login-template/issues) page
2. Create a new issue with detailed information
3. Include device information, error messages, and steps to reproduce

## 🙏 Acknowledgments

- [Expo](https://expo.dev/) for the amazing development platform
- [Firebase](https://firebase.google.com/) for authentication services
- [React Navigation](https://reactnavigation.org/) for navigation
- The React Native community for inspiration and support

---

Built with ❤️ for the React Native community
