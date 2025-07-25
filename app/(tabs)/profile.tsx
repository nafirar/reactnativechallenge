import { BASE_URL } from '@/config/config';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons'; // Import icons
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = await AsyncStorage.getItem("id");
            if (!userId) {
                setLoading(false);
                return;
            }
            try {
                const response = await fetch(`${BASE_URL}/user/${userId}`);
                const data = await response.json();
                setProfile(data);
            } catch (error) {
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <ActivityIndicator style={styles.center} size="large" color="#007AFF" />;

    if (!profile) return (
        <View style={styles.center}>
            <Text style={styles.errorText}>Profile not found.</Text>
        </View>
    );

    const InfoRow = ({ icon, label, value }: { icon: any; label: string; value: string | undefined }) => (
        <View style={styles.infoRow}>
            <Ionicons name={icon} size={20} color="#555" style={styles.icon} />
            <Text style={styles.infoLabel}>{label}:</Text>
            <Text style={styles.infoValue}>{value || 'N/A'}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <Image source={{ uri: profile.image }} style={styles.avatar} />
                <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
                <Text style={styles.username}>@{profile.username}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.role}>{profile.role}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Personal Information</Text>
                <InfoRow icon="mail-outline" label="Email" value={profile.email} />
                <InfoRow icon="call-outline" label="Phone" value={profile.phone} />
                <InfoRow icon="transgender-outline" label="Gender" value={profile.gender} />
                <InfoRow icon="calendar-outline" label="Birth Date" value={profile.birthDate} />
                <InfoRow icon="water-outline" label="Blood Group" value={profile.bloodGroup} />
                <InfoRow icon="school-outline" label="University" value={profile.university} />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Address</Text>
                <InfoRow icon="location-outline" label="Address" value={`${profile.address?.address}, ${profile.address?.city}, ${profile.address?.state} ${profile.address?.postalCode}`} />
                <InfoRow icon="globe-outline" label="Country" value={profile.address?.country} />
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Company</Text>
                <InfoRow icon="business-outline" label="Position" value={`${profile.company?.title} at ${profile.company?.name}`} />
                <InfoRow icon="map-outline" label="Location" value={`${profile.company?.address?.address}, ${profile.company?.address?.city}`} />
            </View>
            
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Crypto</Text>
                <InfoRow icon="wallet-outline" label="Wallet" value={`${profile.crypto?.wallet} (${profile.crypto?.coin})`} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={22} color="white" />
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    contentContainer: {
        paddingBottom: 30,
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    name: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    username: {
        color: '#777',
        fontSize: 16,
        marginBottom: 10,
    },
    roleBadge: {
        backgroundColor: '#007AFF',
        borderRadius: 15,
        paddingVertical: 5,
        paddingHorizontal: 15,
    },
    role: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 15,
        marginBottom: 15,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        marginRight: 15,
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#555',
        width: 100,
    },
    infoValue: {
        color: '#333',
        flex: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        backgroundColor: '#d9534f',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 50,
        marginTop: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    logoutButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    errorText: {
        fontSize: 18,
        color: '#555',
    }
});
0