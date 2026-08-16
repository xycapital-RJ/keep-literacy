import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ScenarioScreen } from '../screens/ScenarioScreen';
import { CourseDetailScreen } from '../screens/CourseDetailScreen';
import { LessonScreen } from '../screens/LessonScreen';
import type { RootStackParamList } from './types';
import type { StoredUser } from '../store/auth.store';
import { Colors } from '../theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {
  user: StoredUser;
  token: string;
  onLogout: () => void;
}

export function AppNavigator({ user, token, onLogout }: Props) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen {...props} user={user} token={token} onLogout={onLogout} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Profile">
          {(props) => (
            <ProfileScreen {...props} user={user} onLogout={onLogout} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Scenario">
          {(props) => <ScenarioScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="CourseDetail">
          {(props) => <CourseDetailScreen {...props} />}
        </Stack.Screen>

        <Stack.Screen name="Lesson">
          {(props) => <LessonScreen {...props} user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
