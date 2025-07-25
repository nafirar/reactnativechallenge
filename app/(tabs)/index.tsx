import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../config/config';

interface Todo {
  id: number;
  title: string;
  description: string;
}

const HomeScreen = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        router.replace('/(auth)/login');
        return;
      }

      const userId = await AsyncStorage.getItem('user_id');
      const response = await fetch(`${BASE_URL}/todos?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch todo list');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    await AsyncStorage.clear();
    await SecureStore.deleteItemAsync('access_token');
    router.replace('/(auth)/login');
  };

  useEffect(() => {
    loadName();
    fetchTodos();
  }, []);

  const loadName = async () => {
    const email = await AsyncStorage.getItem('user_email');
    if (email) {
      const name = email.replace('@gmail.com', '');
      const formatted = name.charAt(0).toUpperCase() + name.slice(1);
      setName(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, {name || 'User'} 👋</Text>

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addText}>+ Tambah To-Do</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.todoItem}>
              <Text style={styles.todoTitle}>{item.title}</Text>
              <Text style={styles.todoDesc}>{item.description}</Text>
            </View>
          )}
        />
      )}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#0d6efd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  addText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoItem: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
    marginBottom: 10,
  },
  todoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  todoDesc: {
    fontSize: 14,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoutText: {
    color: 'red',
    fontWeight: 'bold',
  },
});