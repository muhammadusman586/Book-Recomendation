import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isCheckingAuth: true,

    register: async (username, email, password,) => {

        set({ isLoading: true });
        try {
            const response = await fetch("https://books-backend-4cv9.onrender.com/api/auth/register",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
            return { success: true, message: "User registered successfully" }
        } catch (error) {
            set({ isLoading: false });
            console.log(error)
            return { success: false, message: error.message }
        }
    },
    signIn: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch("https://books-backend-4cv9.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            await AsyncStorage.setItem("token", data.token);
            await AsyncStorage.setItem("user", JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isLoading: false });
            return { success: true, message: "User logged in successfully" }
        } catch (error) {
            set({ isLoading: false });
            console.log(error)
            return { success: false, message: error.message }
        }
    },
    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const token = await AsyncStorage.getItem("token");
            const user = await AsyncStorage.getItem("user");
            if (token && user) {
                set({ user: JSON.parse(user), token, isLoading: false });
            } else {
                set({ user: null, token: null, isLoading: false });
            }
        } catch (error) {
            set({ isLoading: false });
            console.log('Auth check failed', error)
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    logout: async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        set({ user: null, token: null });
    }
}))