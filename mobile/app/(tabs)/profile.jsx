import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { useAuthStore } from '../../store/authStore';

import styles from '../../assets/styles/profile.styles';
import COLORS from '../../constants/colors';
import ProfileHeader from '../../components/ProfileHeader';
import LogouttButton from '../../components/LogouttButton';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../lib/utils';
import Loader from '../../components/Loader';

export default function Profile() {
    const { token } = useAuthStore();

    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deletedBookLoading, setDeletedBookLoading] = useState(false);
    const router = useRouter();
    const baseUrl = "https://books-backend-4cv9.onrender.com";

    const fetchBooks = async () => {
        try {
            setIsLoading(true);

            const response = await fetch(baseUrl + `/api/books/user`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setBooks(data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    const renderRatingStars = (rating = 1) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Ionicons
                    key={i}
                    name={i <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color={i <= rating ? '#f4bf00' : COLORS.textSecondary}
                />
            );
        }
        return stars;
    };
    const handleDelete = async (id) => {
        setDeletedBookLoading(true)
        try {
            const response = await fetch(`${baseUrl}/api/books/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== id));
            // fetchBooks();
            Alert.alert('Success', 'Recommendation deleted successfully');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to delete recommendation');
        } finally {
            setDeletedBookLoading(false)
        }
    }
    const confirmDelete = (id) => {
        Alert.alert(
            'Delete Recommendation',
            'Are you sure you want to delete this recommendation?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => handleDelete(id),
                },
            ],
            { cancelable: true }
        );
    }
    const renderBookIem = ({ item }) => <View style={styles.bookItem}>
        <Image source={item?.image} style={styles.bookImage} contentFit="cover" />
        <View style={styles.bookInfo}>
            <Text style={styles.bookTitle}>{item?.title}</Text>
            <View style={styles.ratingContainer}>
                {renderRatingStars(item?.rating)}
            </View>
            <Text style={styles.bookCaption}>{item?.caption}</Text>
            <Text style={styles.bookDate}>Shared on {formatDate(item?.createdAt)}</Text>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
            {deletedBookLoading ? (
                <Ionicons name="hourglass-outline" size={24} color={COLORS.textSecondary} />
            ) : (
                <Ionicons name="trash-outline" size={24} color={COLORS.textSecondary} />
            )}
        </TouchableOpacity>
    </View>

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchBooks();
        setRefreshing(false);
    }
    useEffect(() => {
        fetchBooks();
    }, []);

    if (isLoading && !refreshing) return <Loader size={50} />
    return (
        <View style={styles.container}>
            <ProfileHeader />
            <LogouttButton />

            {/* your Recommendations */}
            <View style={styles.booksHeader}>
                <Text style={styles.booksTitle}>Your Recommendations</Text>
                <Text style={styles.booksCount}>{books.length} books</Text>
            </View>

            <FlatList
                data={books}
                renderItem={renderBookIem}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.booksList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }

                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={50} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendations yet</Text>
                        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
                            <Text style={styles.addButtonText}>Create a recommendation</Text>
                        </TouchableOpacity>
                    </View>
                }
            />


        </View>
    )
}