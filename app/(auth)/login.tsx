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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert('Error', 'Completá todos los campos');
    return;
  }

  setLoading(true);
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  setLoading(false);

  if (error) {
    Alert.alert('Error', error.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Log F5</Text>
      <Text style={styles.subtitle}>Iniciá sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#1a1a2e" />
        ) : (
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.push('/(auth)/register')}
      >
        <Text style={styles.linkText}>
          ¿No tenés cuenta? <Text style={styles.linkBold}>Registrate</Text>
        </Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  button: {
    backgroundColor: '#4ecca3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#a0a0a0',
    fontSize: 14,
  },
  linkBold: {
    color: '#4ecca3',
    fontWeight: 'bold',
  },
});