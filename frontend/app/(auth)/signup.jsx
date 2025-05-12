import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'

import styles from '../../assets/styles/signup.styles'
import { useState } from 'react';
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore'; // ✅ CORRECT


export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isLoading, register, } = useAuthStore();


    const router = useRouter();
    const handleSignup = async () => {
        const result = await register(username, email, password);
        if (!result.success) Alert.alert('Error', result.message);
    }
    return <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <View style={styles.container}>
            <View style={styles.card}>
                {/* header */}
                <View style={styles.header}>
                    <Text style={styles.title}>BookWorm</Text>
                    <Text style={styles.subtitle}>Share your favourite reads</Text>
                </View>
                {/* form */}
                <View style={styles.formContainer}>
                    {/* username */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="person-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                placeholderTextColor={COLORS.placeholderText}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                        </View>

                    </View>
                    {/* email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="mail-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="b9l6M@example.com"
                                placeholderTextColor={COLORS.placeholderText}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                    {/* password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={20}
                                color={COLORS.primary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="*******"
                                placeholderTextColor={COLORS.placeholderText}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <Ionicons
                                name={showPassword ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color={COLORS.primary}
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        </View>
                    </View>

                    {/* button */}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignup}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}> Already have an account?</Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                        >
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </KeyboardAvoidingView>
}