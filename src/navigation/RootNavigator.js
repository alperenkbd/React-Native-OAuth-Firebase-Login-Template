// Root Navigator - Main entry point for navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '../auth/useAuth';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Stack = createStackNavigator();

/**
 * Loading Screen Component
 */
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
  </View>
);

/**
 * Root Navigator Component
 * Handles navigation between authenticated and unauthenticated flows
 */
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while determining auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {isAuthenticated ? (
          // User is authenticated - show app screens
          <Stack.Screen
            name="AppStack"
            component={AppStack}
            options={{
              animationTypeForReplace: 'push',
            }}
          />
        ) : (
          // User is not authenticated - show auth screens
          <Stack.Screen
            name="AuthStack"
            component={AuthStack}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default RootNavigator; 