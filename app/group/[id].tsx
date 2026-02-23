import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function GroupScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grupo: {id}</Text>
      <Text style={styles.subtitle}>Acá van a ir los partidos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 8,
  },
});