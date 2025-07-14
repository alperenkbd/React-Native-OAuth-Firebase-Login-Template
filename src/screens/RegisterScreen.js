// Register Screen
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
 * Register Screen Component
 */
const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const { register, isLoading, error, clearError } = useAuth();

  // Clear auth errors when component unmounts
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

    // Display name validation
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.trim().length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.displayName.trim()
      );
      
      if (!result.success) {
        // Error is handled by the auth context and displayed via the error state
        console.log('Registration failed:', result.error);
      }
      // Success is handled automatically by auth state change
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  /**
   * Navigate back to login screen
   */
  const navigateToLogin = () => {
    navigation.navigate('Login');
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

    // Clear confirm password error when password changes
    if (field === 'password' && errors.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: null }));
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Display Name"
              placeholder="Enter your full name"
              value={formData.displayName}
              onChangeText={(value) => updateField('displayName', value)}
              autoCapitalize="words"
              autoCorrect={false}
              error={errors.displayName}
              required
              onSubmitEditing={() => emailRef.current?.focus()}
              returnKeyType="next"
            />

            <CustomInput
              ref={emailRef}
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
              placeholder="Create a password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              secureTextEntry={true}
              error={errors.password}
              required
              helperText="Must contain uppercase, lowercase, and number"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              returnKeyType="next"
            />

            <CustomInput
              ref={confirmPasswordRef}
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              secureTextEntry={true}
              error={errors.confirmPassword}
              required
              onSubmitEditing={handleRegister}
              returnKeyType="go"
            />

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <CustomButton
              title="Sign Up"
              onPress={handleRegister}
              loading={isLoading}
              disabled={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <CustomButton
              title="Sign In"
              onPress={navigateToLogin}
              variant="text"
              size="small"
              style={styles.signInButton}
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
  
  registerButton: {
    marginBottom: 16,
  },
  
  termsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  
  termsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  termsLink: {
    color: '#007AFF',
    fontWeight: '500',
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
  
  signInButton: {
    marginLeft: -8, // Adjust for button padding
  },
});

export default RegisterScreen; 