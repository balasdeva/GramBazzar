import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Import all screens
import AccountScreen from '../screens/AccountScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import OtpVerificationScreen from '../screens/OtpVerificationScreen';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import PostListingScreen from '../screens/PostListingScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

import EditPostScreen from '../screens/EditPostScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

import LocalCardCategoryScreen from '../screens/LocalCardCategoryScreen';
import LocalCardDetailScreen from '../screens/LocalCardDetailScreen';
import LocalCardHomeScreen from '../screens/LocalCardHomeScreen';
import LocalCardSearchScreen from '../screens/LocalCardSearchScreen';
import NotificationScreen from '../screens/NotificationScreen';
const Stack = createStackNavigator();



export default function Index() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PhoneLogin" component={PhoneLoginScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="PostListing" component={PostListingScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="LocalCardHome" component={LocalCardHomeScreen} />

      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="EditPost" component={EditPostScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
<Stack.Screen name="LocalCardCategory" component={LocalCardCategoryScreen} />
<Stack.Screen name="LocalCardDetail" component={LocalCardDetailScreen} />
<Stack.Screen name="LocalCardSearch" component={LocalCardSearchScreen} />
    </Stack.Navigator>
  );
}