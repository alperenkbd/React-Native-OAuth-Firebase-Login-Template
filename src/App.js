// Main App Component
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthProvider } from './auth/AuthProvider';
import RootNavigator from './navigation/RootNavigator';

/**
 * Main App Component
 * Entry point for the React Native Login Template
 */
const App = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App; 