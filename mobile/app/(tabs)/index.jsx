import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../../assets/styles/home.styles';
import { useAuthStore } from '../../store/authStore';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatDate, } from '../../lib/utils';
import COLORS from '../../constants/colors';
import Loader from '../../components/Loader';

export default function Home() {
    const { token } = useAuthStore();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const baseUrl = "https://books-backend-4cv9.onrender.com";

    const fetchBooks = async (pageNum = 1, refresh = false) => {
        try {
            if (refresh) setRefreshing(true);
            else if (pageNum === 1) setLoading(true);

            const response = await fetch(baseUrl + `/api/books?page=${pageNum}&limit=2`, {
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

            const uniqueBooks =
                refresh || pageNum === 1
                    ? data.books
                    : Array.from(new Set([...books, ...data.books].map((book) => book._id))).map(
                        (id) => [...books, ...data.books].find((book) => book._id === id)
                    );
            setBooks(uniqueBooks);
            setHasMore(pageNum < data.totalPages);
            setPage(pageNum);
        } catch (error) {
            console.log(error);
        } finally {
            if (refresh) setRefreshing(false);
            else setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.bookCard}>
            <View style={styles.bookHeader}>
                <View style={styles.userInfo}>
                    <Image source={item?.user?.image} style={styles.avatar} />
                    <Text style={styles.username}>{item?.user?.username}</Text>
                </View>
            </View>

            <View style={styles.bookImageContainer}>
                <Image source={item?.image} style={styles.bookImage} contentFit="cover" />
            </View>

            <View style={styles.bookDetails}>
                <Text style={styles.bookTitle}>{item?.title}</Text>
                <View style={styles.ratingContainer}>{renderRatingStars(item?.rating)}</View>
                <Text style={styles.caption}>{item?.caption}</Text>
                <Text style={styles.date}>Shared on {formatDate(item?.createdAt)}</Text>
            </View>
        </View>
    );

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

    const handleLoadMore = async () => {
        if (hasMore && !loading && !refreshing) {
            await fetchBooks(page + 1);
        }
    };

    const renderFooter = () => {
        if (hasMore && books.length > 0) {
            return (
                <ActivityIndicator style={styles.footerLoader} size="large" color={COLORS.primary} />
            );
        }
        return null;
    };

    useEffect(() => {
        fetchBooks();
    }, []);
    if (loading) return <Loader size={50} />
    return (
        <View style={styles.container}>
            <FlatList
                keyExtractor={(item) => item._id}
                data={books}
                renderItem={renderItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchBooks(1, true)}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>BookWorm</Text>
                        <Text style={styles.headerSubtitle}>Discover great reads from the community </Text>
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="book-outline" size={64} color={COLORS.textSecondary} />
                        <Text style={styles.emptyText}>No recommendations yet </Text>
                        <Text style={styles.emptySubtext}>Be the first to share a book! </Text>
                    </View>
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
            />
        </View>
    );
}