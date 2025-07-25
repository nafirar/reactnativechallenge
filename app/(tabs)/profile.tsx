import { BASE_URL } from '@/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const ProfileScreen = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            const userId = await AsyncStorage.getItem("id");
            if (!userId) return;
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

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    if (!profile) return (
        <View style={styles.center}>
            <Text>Profile not found.</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: profile.image }} style={styles.avatar} />
                <Text style={styles.name}>{profile.firstName} {profile.lastName}</Text>
                <Text style={styles.username}>@{profile.username}</Text>
                <Text style={styles.role}>{profile.role}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Email:</Text>
                <Text>{profile.email}</Text>
                <Text style={styles.label}>Phone:</Text>
                <Text>{profile.phone}</Text>
                <Text style={styles.label}>Gender:</Text>
                <Text>{profile.gender}</Text>
                <Text style={styles.label}>Birth Date:</Text>
                <Text>{profile.birthDate}</Text>
                <Text style={styles.label}>Blood Group:</Text>
                <Text>{profile.bloodGroup}</Text>
                <Text style={styles.label}>University:</Text>
                <Text>{profile.university}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Address:</Text>
                <Text>{profile.address?.address}, {profile.address?.city}, {profile.address?.state} {profile.address?.postalCode}</Text>
                <Text>{profile.address?.country}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Company:</Text>
                <Text>{profile.company?.title} at {profile.company?.name}</Text>
                <Text>{profile.company?.address?.address}, {profile.company?.address?.city}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.label}>Crypto Wallet:</Text>
                <Text>{profile.crypto?.wallet} ({profile.crypto?.coin})</Text>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: { alignItems: 'center', marginVertical: 24 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    name: { fontSize: 22, fontWeight: 'bold' },
    username: { color: '#888', marginBottom: 4 },
    role: { color: '#0d6efd', fontWeight: 'bold', marginBottom: 8 },
    section: { marginHorizontal: 20, marginBottom: 16 },
    label: { fontWeight: 'bold', marginTop: 8 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});