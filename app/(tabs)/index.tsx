import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { supabase } from '@/lib/supabase';

type Group = {
  id: string;
  name: string;
  invite_code: string;
  role: string;
};

export default function HomeScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('group_members')
      .select(`
        role,
        group:groups (
          id,
          name,
          invite_code
        )
      `)
      .eq('user_id', user.id);

    if (!error && data) {
      const formatted = data.map((item: any) => ({
        id: item.group.id,
        name: item.group.name,
        invite_code: item.group.invite_code,
        role: item.role,
      }));
      setGroups(formatted);
    }
    setLoading(false);
  };

  // Recargar grupos cada vez que la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => router.push({ pathname: '/group/[id]', params: { id: item.id } })}
    >
      <View style={styles.groupHeader}>
        <Text style={styles.groupName}>{item.name}</Text>
        {item.role === 'admin' && (
          <Text style={styles.adminBadge}>Admin</Text>
        )}
      </View>
      <Text style={styles.inviteCode}>Código: {item.invite_code}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Log F5</Text>
      <Text style={styles.subtitle}>Tus grupos</Text>

      {loading ? (
        <ActivityIndicator color="#4ecca3" size="large" style={{ marginTop: 40 }} />
      ) : groups.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No tenés grupos todavía</Text>
          <Text style={styles.emptySubtext}>
            Creá uno o unite con un código de invitación
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroup}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push('/group/create')}
        >
          <Text style={styles.createButtonText}>+ Crear Grupo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => router.push('/group/join')}
        >
          <Text style={styles.joinButtonText}>Unirse con código</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#a0a0a0',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  groupCard: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4ecca3',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    flex: 1,
  },
  adminBadge: {
    backgroundColor: '#4ecca3',
    color: '#1a1a2e',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  inviteCode: {
    color: '#a0a0a0',
    fontSize: 12,
    marginTop: 8,
  },
  bottomButtons: {
    gap: 10,
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: '#4ecca3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  joinButton: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4ecca3',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ecca3',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});