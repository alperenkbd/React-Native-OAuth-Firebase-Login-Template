// Login Screen
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAuth } from '../auth/useAuth';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

/**
 * Login Screen Component
 */
const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef(null);
  const { login, isLoading, error, clearError, isFirebaseConfigured } = useAuth();

  // Clear auth errors when component unmounts or when clearing manually
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Clear auth error when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData, clearError, error]);

  /**
   * Validate form inputs
   * @returns {boolean} - Whether form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result.success) {
        // Error is handled by the auth context and displayed via the error state
        console.log('Login failed:', result.error);
      }
      // Success is handled automatically by auth state change
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  /**
   * Handle forgot password
   */
  const handleForgotPassword = () => {
    if (!formData.email) {
      Alert.alert(
        'Email Required',
        'Please enter your email address first, then tap "Forgot Password?" again.'
      );
      return;
    }

    Alert.alert(
      'Reset Password',
      `Send password reset instructions to ${formData.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            // You can implement password reset here
            Alert.alert(
              'Email Sent',
              'Password reset instructions have been sent to your email address.'
            );
          },
        },
      ]
    );
  };

  /**
   * Navigate to register screen
   */
  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  /**
   * Update form field
   */
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          {!isFirebaseConfigured && (
            <View style={styles.configNotice}>
              <Text style={styles.configNoticeTitle}>🔧 Firebase Setup Required</Text>
              <Text style={styles.configNoticeText}>
                To test the authentication features, please configure Firebase:
              </Text>
              <Text style={styles.configNoticeSteps}>
                1. Create a Firebase project at console.firebase.google.com{'\n'}
                2. Enable Authentication → Email/Password{'\n'}
                3. Add your config to the .env file{'\n'}
                4. Restart the app
              </Text>
              <Text style={styles.configNoticeFooter}>
                You can still explore the UI components below!
              </Text>
            </View>
          )}

          <View style={styles.form}>
            <CustomInput
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              error={errors.email}
              required
              onSubmitEditing={() => passwordRef.current?.focus()}
              returnKeyType="next"
            />

            <CustomInput
              ref={passwordRef}
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry={true}
              error={errors.password}
              required
              onSubmitEditing={handleLogin}
              returnKeyType="go"
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading || !isFirebaseConfigured}
              style={styles.loginButton}
            />

            <CustomButton
              title="Forgot Password?"
              onPress={handleForgotPassword}
              variant="text"
              size="small"
              style={styles.forgotButton}
              disabled={!isFirebaseConfigured}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <CustomButton
              title="Sign Up"
              onPress={navigateToRegister}
              variant="text"
              size="small"
              style={styles.signUpButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },

  configNotice: {
    backgroundColor: '#E8F4FD',
    borderColor: '#007AFF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },

  configNoticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
  },

  configNoticeText: {
    fontSize: 14,
    color: '#1D1D1F',
    marginBottom: 12,
    lineHeight: 20,
  },

  configNoticeSteps: {
    fontSize: 13,
    color: '#1D1D1F',
    marginBottom: 12,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 6,
  },

  configNoticeFooter: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  
  form: {
    flex: 1,
    marginBottom: 40,
  },
  
  errorContainer: {
    backgroundColor: '#FFF2F2',
    borderColor: '#FF3B30',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
  },
  
  loginButton: {
    marginBottom: 16,
  },
  
  forgotButton: {
    alignSelf: 'center',
  },
  
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  
  footerText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  
  signUpButton: {
    marginLeft: -8, // Adjust for button padding
  },
});

export default LoginScreen; 