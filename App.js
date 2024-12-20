import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen'; // Ensure this path is correct
import SignupScreen from './src/screens/SignupScreen';
import FeedScreen from './src/screens/FeedScreen';
import StoryScreen from './src/screens/StoryScreen';
import ProfileScreen from './src/screens/ProfileScreen'
import PostScreen from './src/screens/PostScreen'

const Stack = createStackNavigator();

export default function App() {   
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login"        component={LoginScreen}     options={{ headerShown: false }}/>
        <Stack.Screen name="Signup"       component={SignupScreen}    options={{ headerShown: false }}/>
        <Stack.Screen name="Feed"         component={FeedScreen}      options={{ headerShown: false }}/>
        <Stack.Screen name="StoryScreen"  component={StoryScreen}     options={{ headerShown: false }}/>
        <Stack.Screen name="Profile"      component={ProfileScreen}   options={{ headerShown: false }}/>
        <Stack.Screen name="PostScreen"   component={PostScreen}      options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
