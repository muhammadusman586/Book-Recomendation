import { View, Text } from 'react-native'
import styles from '../assets/styles/profile.styles';
import { useAuthStore } from '../store/authStore';
import { Image } from 'expo-image';
import { formatMebmerSince } from '../lib/utils';
const ProfileHeader = () => {
    const { user } = useAuthStore();
    return (
        <View style={styles.profileHeader}>
            <Image source={user?.image} style={styles.profileImage} />
            <View style={styles.profileInfo} >
                <Text style={styles.username}>{user?.username}</Text>
                <Text style={styles.email}>{user?.email}</Text>
                <Text style={styles.memberSince}>Joined {formatMebmerSince(user?.createdAt)}</Text>

            </View>
        </View>
    )
}

export default ProfileHeader