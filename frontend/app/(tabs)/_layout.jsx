import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import COLORS from '../../constants/Colors'
import {IonIcons} from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Tablayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        headerTitleStyle: {
          color: COLORS.textPrimary,
          fontWeight: '600',
        },
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingTop: 5,
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
      }}
      >
      <Tabs.Screen name="index" 
      options={{
        title: 'Home',
        tabBarIcon: ({color,size}) => (<IonIcons 
        name="home-outline" 
        size={size} 
        color={color} />),  
        }}
      />

      <Tabs.Screen name="create"
      options={{
        title: 'Create',
        tabBarIcon: ({color,size}) => (<IonIcons 
          name="add-circle-outline" 
          size={size} 
          color={color} />), 
        }}
      />

      <Tabs.Screen name="profile"
      options={{
        title: 'Profile',
        tabBarIcon: ({color,size}) => (<IonIcons 
          name="person-outline" 
          size={size} 
          color={color} />), 
        }}
      />

    </Tabs>
  )
}