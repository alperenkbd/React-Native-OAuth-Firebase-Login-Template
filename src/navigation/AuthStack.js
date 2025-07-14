// Auth Stack Navigator - For unauthenticated users
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();

/**
 * Authentication Stack Navigator
 * Contains screens for unauthenticated users
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
        animationEnabled: true,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: 'Sign In',
        }}
      />
      
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          title: 'Sign Up',
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack; 