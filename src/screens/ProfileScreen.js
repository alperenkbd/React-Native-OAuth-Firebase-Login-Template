// Profile Screen
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAuth } from '../auth/useAuth';
import CustomButton from '../components/CustomButton';

/**
 * Profile Screen Component
 * Displays user profile information and account management options
 */
const ProfileScreen = ({ navigation }) => {
  const {
    user,
    userDisplayName,
    userEmail,
    userId,
    isEmailVerified,
    logout,
    isLoading,
  } = useAuth();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  /**
   * Handle user logout
   */
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              const result = await logout();
              if (!result.success) {
                Alert.alert('Error', result.error || 'Failed to sign out. Please try again.');
              }
              // Success is handled automatically by auth state change
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'An unexpected error occurred while signing out.');
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  /**
   * Handle account actions
   */
  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature would typically navigate to a change password screen or send a password reset email.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This is a destructive action that would permanently delete your account. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deletion',
              'This feature would typically require additional verification and implement account deletion logic.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleVerifyEmail = () => {
    Alert.alert(
      'Verify Email',
      'A verification email will be sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            // Implement email verification resend logic here
            Alert.alert(
              'Verification Email Sent',
              'Please check your email and click the verification link.'
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : userEmail?.charAt(0).toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.displayName}>
            {userDisplayName || 'No Name Set'}
          </Text>
          <Text style={styles.email}>{userEmail}</Text>
          <View style={styles.verificationBadge}>
            <Text style={[
              styles.verificationText,
              isEmailVerified ? styles.verified : styles.unverified
            ]}>
              {isEmailVerified ? '✓ Verified' : '⚠ Unverified'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoCard}>
              <InfoRow label="User ID" value={userId} />
              <InfoRow label="Email" value={userEmail} />
              <InfoRow label="Display Name" value={userDisplayName || 'Not set'} />
              <InfoRow 
                label="Email Verified" 
                value={isEmailVerified ? 'Yes' : 'No'}
                valueColor={isEmailVerified ? '#34C759' : '#FF9500'}
              />
              <InfoRow 
                label="Account Created" 
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'} 
              />
              {user?.lastLoginAt && (
                <InfoRow 
                  label="Last Login" 
                  value={new Date(user.lastLoginAt).toLocaleDateString()} 
                />
              )}
            </View>
          </View>

          {!isEmailVerified && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Email Verification</Text>
              <View style={styles.verificationCard}>
                <Text style={styles.verificationMessage}>
                  Your email address is not verified. Please verify your email to access all features.
                </Text>
                <CustomButton
                  title="Send Verification Email"
                  onPress={handleVerifyEmail}
                  variant="outline"
                  style={styles.verificationButton}
                />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Settings</Text>
            
            <View style={styles.actionsCard}>
              <CustomButton
                title="Change Password"
                onPress={handleChangePassword}
                variant="secondary"
                style={styles.actionButton}
              />
              
              <CustomButton
                title="Update Profile"
                onPress={() => {
                  Alert.alert('Update Profile', 'This would navigate to a profile editing screen.');
                }}
                variant="secondary"
                style={styles.actionButton}
              />
              
              <CustomButton
                title="Privacy Settings"
                onPress={() => {
                  Alert.alert('Privacy Settings', 'This would show privacy and data management options.');
                }}
                variant="secondary"
                style={styles.actionButton}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Danger Zone</Text>
            
            <View style={styles.dangerCard}>
              <CustomButton
                title="Delete Account"
                onPress={handleDeleteAccount}
                variant="outline"
                style={[styles.actionButton, styles.deleteButton]}
                textStyle={styles.deleteButtonText}
              />
            </View>
          </View>

          <View style={styles.logoutSection}>
            <CustomButton
              title="Sign Out"
              onPress={handleLogout}
              loading={isLoggingOut}
              disabled={isLoggingOut || isLoading}
              variant="primary"
              style={styles.logoutButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Info Row Component
 */
const InfoRow = ({ label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  
  email: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 12,
  },
  
  verificationBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  
  verificationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  
  verified: {
    color: '#34C759',
  },
  
  unverified: {
    color: '#FF9500',
  },
  
  content: {
    gap: 24,
  },
  
  section: {
    gap: 12,
  },
  
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  
  infoLabel: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  
  infoValue: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  
  verificationCard: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF9500',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
  },
  
  verificationMessage: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  
  verificationButton: {
    alignSelf: 'flex-start',
  },
  
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  actionButton: {
    marginBottom: 12,
  },
  
  dangerCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF3B30',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
  },
  
  deleteButton: {
    borderColor: '#FF3B30',
  },
  
  deleteButtonText: {
    color: '#FF3B30',
  },
  
  logoutSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
});

export default ProfileScreen; 