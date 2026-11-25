import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SepetProvider } from '../context/SepetContext';

export default function RootLayout() {
  return (
    <SepetProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: '#171f35',
          headerTitleStyle: { fontWeight: '700' },
          headerStyle: { backgroundColor: '#ffffff' },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: '#f3f4f8' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Ürünler' }} />
        <Stack.Screen name="urun/[id]" options={{ title: 'Ürün Detayı' }} />
        <Stack.Screen name="sepet" options={{ title: 'Sepetim' }} />
      </Stack>
    </SepetProvider>
  );
}
