import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../config/config';

interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  description: string;
}

const HomeScreen = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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

      const userId = await AsyncStorage.getItem("id");
      if (!userId) {
          throw new Error('User ID not found');
      }
      
      const response = await fetch(`${BASE_URL}/todos/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      setTodos(data.todos);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch todo list');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const handleLogout = async () => {
    await AsyncStorage.clear();
    await SecureStore.deleteItemAsync('access_token');
    router.replace('/(auth)/login');
  };

  const loadName = async () => {
    const username = await AsyncStorage.getItem("username");
    setName(username || 'User');
  };

  useEffect(() => {
    loadName();
    fetchTodos();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTodos();
  }, []);

  const toggleCompleted = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    // You can add a backend update call here if needed
  };

  const renderTodoItem = ({ item }: { item: Todo }) => (
    <View style={styles.todoCard}>
      <TouchableOpacity style={styles.todoContent} onPress={() => toggleCompleted(item.id)} activeOpacity={0.7}>
        <Checkbox
          style={styles.checkbox}
          value={item.completed}
          onValueChange={() => toggleCompleted(item.id)}
          color={item.completed ? '#007AFF' : undefined}
        />
        <Text style={[styles.todoTitle, item.completed && styles.todoTitleDone]}>
          {item.todo}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, {name} 👋</Text>
        <Text style={styles.subtitle}>Here are your tasks for today.</Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/(tabs)/add-todo')}
      >
        <Ionicons name="add-circle-outline" size={22} color="white" />
        <Text style={styles.addButtonText}>Add New To-Do</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }}/>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTodoItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Ionicons name="file-tray-stacked-outline" size={60} color="#ccc" />
                <Text style={styles.emptyText}>No to-dos yet. Add one!</Text>
            </View>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007AFF']} />
          }
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#d9534f" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  todoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  todoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  checkbox: {
    marginRight: 15,
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  todoTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  todoTitleDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 10,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
    paddingBottom: 25,
  },
  logoutButtonText: {
    color: '#d9534f',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});
