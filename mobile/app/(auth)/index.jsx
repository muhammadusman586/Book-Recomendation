import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import { Link } from 'expo-router'
import  { useState } from 'react'
import styles from "../../assets/styles/login.styles";
import COLORS from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
// import Loader from '../../components/Loader';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { isLoading, signIn, isChackingAuth } = useAuthStore();

    const handleLogin = async () => {
        const result = await signIn(email, password);
        if (!result.success) Alert.alert('Error', result.message);

    }
    // if (isChackingAuth) return <Loader size={50} />
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                        source={require('../../assets/images/i.png')}
                        style={styles.illustrationImage}
                        resizeMode='contain'
                    />
                </View>
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    style={styles.inputIcon}
                                    color={COLORS.primary}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your email"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType='email-address'
                                    autoCapitalize="none"
                                />
                            </View>

                        </View>
                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                {/* Left Icon */}
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    style={styles.inputIcon}
                                    color={COLORS.primary}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Ionicons
                                        name={!showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                        {/* footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>Signup</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>

            </View>
        </KeyboardAvoidingView>
    )
}