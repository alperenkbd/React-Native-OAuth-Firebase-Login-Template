// Home Screen
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { useAuth } from '../auth/useAuth';
import CustomButton from '../components/CustomButton';

/**
 * Home Screen Component
 * Main screen for authenticated users
 */
const HomeScreen = ({ navigation }) => {
  const { user, userDisplayName, userEmail, isEmailVerified } = useAuth();

  const handleNavigateToProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>
            Welcome{userDisplayName ? `, ${userDisplayName}` : ''}!
          </Text>
          <Text style={styles.subtitle}>
            You're successfully signed in
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Account Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{userEmail}</Text>
            </View>
            {userDisplayName && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{userDisplayName}</Text>
              </View>
            )}
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email Verified:</Text>
              <Text style={[
                styles.infoValue,
                isEmailVerified ? styles.verified : styles.unverified
              ]}>
                {isEmailVerified ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>

          {!isEmailVerified && (
            <View style={styles.verificationCard}>
              <Text style={styles.verificationTitle}>
                📧 Email Verification Required
              </Text>
              <Text style={styles.verificationText}>
                Please check your email and click the verification link to activate your account.
              </Text>
              <CustomButton
                title="Resend Verification Email"
                onPress={() => {
                  // Implement resend verification logic here
                  console.log('Resend verification email');
                }}
                variant="outline"
                size="small"
                style={styles.resendButton}
              />
            </View>
          )}

          <View style={styles.actionsCard}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            
            <CustomButton
              title="View Profile"
              onPress={handleNavigateToProfile}
              variant="secondary"
              style={styles.actionButton}
            />

            <CustomButton
              title="Refresh Token"
              onPress={() => {
                // Implement token refresh logic here
                console.log('Refresh token');
              }}
              variant="outline"
              style={styles.actionButton}
            />
          </View>

          <View style={styles.featuresCard}>
            <Text style={styles.cardTitle}>Template Features</Text>
            <View style={styles.featuresList}>
              <FeatureItem icon="🔐" text="Firebase Authentication" />
              <FeatureItem icon="📱" text="Email + Password Login" />
              <FeatureItem icon="🔄" text="JWT Token Management" />
              <FeatureItem icon="💾" text="Secure Storage" />
              <FeatureItem icon="🚦" text="Rate Limiting" />
              <FeatureItem icon="📡" text="Context API State Management" />
              <FeatureItem icon="🧭" text="React Navigation" />
              <FeatureItem icon="✨" text="Modern UI Components" />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

/**
 * Feature Item Component
 */
const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
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
    marginBottom: 30,
    alignItems: 'center',
  },
  
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
  },
  
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  
  content: {
    gap: 20,
  },
  
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
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
  
  verified: {
    color: '#34C759',
  },
  
  unverified: {
    color: '#FF9500',
  },
  
  verificationCard: {
    backgroundColor: '#FFF4E6',
    borderColor: '#FF9500',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
  },
  
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
    marginBottom: 8,
  },
  
  verificationText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  
  resendButton: {
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
  
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  featuresList: {
    gap: 12,
  },
  
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  
  featureText: {
    fontSize: 16,
    color: '#1D1D1F',
    flex: 1,
  },
});

export default HomeScreen; 