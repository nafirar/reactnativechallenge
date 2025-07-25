import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BASE_URL } from '../../config/config';

const AddTodoScreen = () => {
  const [title, setTitle] = useState('');
  const router = useRouter();

  const handleAdd = async () => {
  if (!title.trim()) {
    Alert.alert('Judul wajib diisi');
    return;
  }
  const userId = await AsyncStorage.getItem('id');
  try {
    const response = await fetch(`${BASE_URL}/todos/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        todo: title,
        completed: false,
        userId: userId,
      }),
    });
    if (!response.ok) throw new Error('Gagal menambah todo');
    const data = await response.json();
    console.log(data);
    Alert.alert('Sukses', 'Todo berhasil ditambahkan');
    router.back();
  } catch (error) {
    Alert.alert('Error', 'Gagal menambah todo');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Judul</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Tambah</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTodoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontWeight: 'bold', marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginTop: 4 },
  button: { backgroundColor: '#0d6efd', padding: 12, borderRadius: 6, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});