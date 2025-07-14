// App Stack Navigator - For authenticated users
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * Tab Navigator for main app screens
 */
const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            // You can replace this with an actual icon component
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            // You can replace this with an actual icon component
            <ProfileIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

/**
 * Simple icon components (replace with your preferred icon library)
 */
const HomeIcon = ({ color, size }) => (
  <Text style={{ color, fontSize: size }}>🏠</Text>
);

const ProfileIcon = ({ color, size }) => (
  <Text style={{ color, fontSize: size }}>👤</Text>
);

/**
 * App Stack Navigator
 * Contains screens for authenticated users
 */
const AppStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
      />
      
      {/* Add additional screens here that should be accessible from tabs */}
      {/* Example:
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
        }}
      />
      */}
    </Stack.Navigator>
  );
};

export default AppStack; 