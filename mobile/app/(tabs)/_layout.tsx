import { FontAwesome, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: colorScheme === 'dark' ? '#1E293B' : '#E2E8F0',
          height: 60,
          paddingBottom: 10,
        },
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTitleStyle: {
          fontWeight: '800',
          color: theme.text,
        },
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Safety',
          tabBarIcon: ({ color }) => <FontAwesome name="shield" size={24} color={color} />,
          headerTitle: 'SafeQuest Safety',
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <MaterialIcons name="explore" size={24} color={color} />,
          headerTitle: 'Place Intelligence',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color }) => <Ionicons name="chatbubble-ellipses" size={24} color={color} />,
          headerTitle: 'Travel Copilot',
        }}
      />
      <Tabs.Screen
        name="guardians"
        options={{
          title: 'Guardians',
          tabBarIcon: ({ color }) => <MaterialIcons name="security" size={24} color={color} />,

          headerTitle: 'Guardian View',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
          headerTitle: 'Your Passport',
        }}
      />

    </Tabs>
  );
}

