import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import styles from "../../assets/styles/create.styles"
import COLORS from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuthStore } from '../../store/authStore';

export default function Create() {
    const [title, setTitle] = useState("")
    const [caption, setCaption] = useState("")
    const [rating, setRating] = useState(1)
    const [image, setImage] = useState(null) // to display it when select the image
    const [imageBase64, setImageBase64] = useState(null)
    const [loading, setLoading] = useState(false)
    const basUrl = "https://books-backend-4cv9.onrender.com";

    const router = useRouter()
    const { token } = useAuthStore();
    const pickImage = async () => {
        // Request permissions to access the gallery
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (Platform.OS !== 'web') {
                if (status === 'granted') {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: 'Images',
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 0.5,
                        base64: true
                    });
                    if (!result.canceled) {
                        setImage(result.assets[0].uri);
                        // if base64 is provided use it 
                        if (result.assets[0].base64) {
                            setImageBase64(result.assets[0].base64);
                        } else {
                            // convert uri to base64
                            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, { encoding: FileSystem.EncodingType.Base64 });
                            setImageBase64(base64);
                        }
                    }
                } else {
                    Alert.alert('Permission denied', 'You need to grant permission to access the gallery.');
                    return
                }
            }
        } catch (error) {
            console.log("Error picking image", error);
            Alert.alert('Error', 'There was an error selecting the image.');
        }
    }

    const handleSubmit = async () => {
        if (!title || !imageBase64 || !caption || !rating) {
            Alert.alert("Error", "All fields are required")
            return
        }

        try {
            setLoading(true)
            // get file extension from URI  or default to jpeg
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1]
            const imageType = fileType ? `image/${fileType.toLowerCase()}` : 'image/jpeg';
            const imageDataUrl = `data:${imageType};base64,${imageBase64}`;


            const response = await fetch(basUrl + `/api/books/create`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    caption,
                    rating: rating.toString(),
                    image: imageDataUrl
                }),
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }
            Alert.alert("Success", "Your book recommandation has been posted")

            // reset fields
            setTitle("")
            setCaption("")
            setRating(1)
            setImage(null)
            setImageBase64(null)
            router.push("/")
        } catch (error) {
            console.log("Error creating book", error);
            Alert.alert("Error", error.message || "Something went wrong");
        } finally {
            setLoading(false)
        }

    }

    const renderRatingPicker = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => setRating(i)}
                    style={styles.starButton}
                >
                    <Ionicons
                        name={i <= rating ? "star" : "star-outline"}
                        size={32}
                        color={i <= rating ? "#f4bf00" : COLORS.textSecondary}
                    />
                </TouchableOpacity>
            )
        }
        return <View style={styles.ratingContainer}>{stars}</View>
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        >
            <ScrollView
                contentContainerStyle={styles.container}
                style={styles.scrollViewStyle}
            >
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Add Book Recommandation</Text>
                        <Text style={styles.subtitle}>Share your favourite reads with the world</Text>
                    </View>
                    <View style={styles.form}>
                        {/* Title */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Title</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons
                                    name="book-outline"
                                    size={20}
                                    color={COLORS.textSecondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter title"
                                    placeholderTextColor={COLORS.placeholderText}
                                    value={title}
                                    onChangeText={setTitle}
                                />
                            </View>
                        </View>
                        {/* Rating */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Rating</Text>
                            {renderRatingPicker()}
                        </View>

                        {/* Image */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Book Image</Text>
                            <TouchableOpacity
                                style={styles.imagePicker}
                                onPress={pickImage}
                            >
                                {image ? <Image
                                    source={{ uri: image }} // Display the selected image
                                    style={styles.previewImage}
                                />
                                    : <View style={styles.placeholderContainer}>
                                        <Ionicons
                                            name="image-outline"
                                            size={40}
                                            color={COLORS.textSecondary}
                                        />
                                        <Text style={styles.placeholderText}>Select Image</Text>
                                    </View>}
                            </TouchableOpacity>

                        </View>
                        {/* Caption */}
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Caption</Text>
                            <TextInput
                                style={styles.textArea}
                                placeholder="Write your review or thoughts about yhis book..."
                                placeholderTextColor={COLORS.placeholderText}
                                value={caption}
                                onChangeText={setCaption}
                                multiline
                            />
                        </View>
                        {/* Submit */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Ionicons
                                        name="cloud-upload-outline"
                                        size={20}
                                        color={COLORS.white}
                                        style={styles.buttonIcon}
                                    />
                                    <Text style={styles.buttonText}>Submit</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}