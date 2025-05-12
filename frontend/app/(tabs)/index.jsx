import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuthStore } from '../../store/authStore'; // Importing the auth store

export default function Home() {
  const {logout} = useAuthStore(); // Added useAuthStore() to retrieve logout function
  return (
    <View>
      <Text>Home tab</Text>
      <TouchableOpacity
        onPress={logout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}