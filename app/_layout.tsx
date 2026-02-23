import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { Stack, SplashScreen } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

SplashScreen.preventAutoHideAsync();

function useProtectedRoute(session: Session | null, isReady: boolean) {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [session, isReady, segments]);
}

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
      SplashScreen.hideAsync();
    });

    // Escuchar cambios de auth (login, logout, etc)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useProtectedRoute(session, isReady);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}