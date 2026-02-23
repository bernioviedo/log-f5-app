import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function CreateGroupScreen() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Ponele un nombre al grupo');
      return;
    }

    setLoading(true);

    // Obtener usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      Alert.alert('Error', 'No estás logueado');
      return;
    }

    // 1. Crear el grupo
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({
        name: name.trim(),
        created_by: user.id,
      })
      .select()
      .single();

    if (groupError) {
      setLoading(false);
      Alert.alert('Error', groupError.message);
      return;
    }

    // 2. Agregar al creador como admin del grupo
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'admin',
      });

    setLoading(false);

    if (memberError) {
      Alert.alert('Error', memberError.message);
      return;
    }

    Alert.alert('¡Listo!', `Grupo "${group.name}" creado`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Grupo</Text>
      <Text style={styles.subtitle}>
        Creá un grupo para empezar a loggear partidos con tus amigos
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre del grupo"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1a1a2e" />
        ) : (
          <Text style={styles.buttonText}>Crear Grupo</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0a0',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#16213e',
    color: '#ffffff',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  button: {
    backgroundColor: '#4ecca3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  cancelButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#a0a0a0',
    fontSize: 14,
  },
});