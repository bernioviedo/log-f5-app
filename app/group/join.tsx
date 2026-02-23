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

export default function JoinGroupScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    if (!code.trim()) {
      Alert.alert('Error', 'Ingresá el código de invitación');
      return;
    }

    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      Alert.alert('Error', 'No estás logueado');
      return;
    }

    // 1. Buscar el grupo por código
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .select('id, name')
      .eq('invite_code', code.trim())
      .single();

    if (groupError || !group) {
      setLoading(false);
      Alert.alert('Error', 'No se encontró ningún grupo con ese código');
      return;
    }

    // 2. Verificar si ya es miembro
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      setLoading(false);
      Alert.alert('Info', 'Ya sos miembro de este grupo');
      return;
    }

    // 3. Unirse al grupo
    const { error: joinError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
      });

    setLoading(false);

    if (joinError) {
      Alert.alert('Error', joinError.message);
      return;
    }

    Alert.alert('¡Listo!', `Te uniste a "${group.name}"`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unirse a un Grupo</Text>
      <Text style={styles.subtitle}>
        Pedile el código de invitación al admin del grupo
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Código de invitación"
        placeholderTextColor="#666"
        value={code}
        onChangeText={setCode}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleJoin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1a1a2e" />
        ) : (
          <Text style={styles.buttonText}>Unirse</Text>
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