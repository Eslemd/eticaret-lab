import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import UrunKarti from '../components/UrunKarti';
import { useSepet } from '../context/SepetContext';

const URUN_API = 'https://dummyjson.com/products';

/** @typedef {{ sorgu: string, deneme: number, urunler: import('../context/SepetContext').Urun[], hata: boolean }} ListeSonucu */

export default function AnaSayfa() {
  const router = useRouter();
  const { toplamAdet } = useSepet();
  const [arama, setArama] = useState('');
  const [deneme, setDeneme] = useState(0);
  const [sonuc, setSonuc] = useState(/** @type {ListeSonucu | null} */ (null));
  const sorgu = arama.trim();
  const yukleniyor = sonuc?.sorgu !== sorgu || sonuc?.deneme !== deneme;

  useEffect(() => {
    const istek = new AbortController();
    const url = sorgu
      ? `${URUN_API}/search?q=${encodeURIComponent(sorgu)}`
      : `${URUN_API}?limit=20`;

    async function urunleriGetir() {
      try {
        const cevap = await fetch(url, { signal: istek.signal });
        if (!cevap.ok) {
          throw new Error(`HTTP ${cevap.status}`);
        }

        const veri = await cevap.json();
        if (!Array.isArray(veri.products)) {
          throw new Error('Geçersiz ürün listesi');
        }

        if (!istek.signal.aborted) {
          setSonuc({ sorgu, deneme, urunler: veri.products, hata: false });
        }
      } catch {
        if (!istek.signal.aborted) {
          setSonuc({ sorgu, deneme, urunler: [], hata: true });
        }
      }
    }

    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let zamanlayici;
    if (sorgu) {
      zamanlayici = setTimeout(urunleriGetir, 300);
    } else {
      urunleriGetir();
    }

    return () => {
      clearTimeout(zamanlayici);
      istek.abort();
    };
  }, [sorgu, deneme]);

  let icerik;
  if (!sonuc || yukleniyor) {
    icerik = (
      <View style={styles.durum} accessibilityRole="progressbar" accessibilityLabel="Ürünler yükleniyor">
        <ActivityIndicator color="#2449ad" size="large" />
        <Text style={styles.durumMetni}>Ürünler yükleniyor…</Text>
      </View>
    );
  } else if (sonuc.hata) {
    icerik = (
      <View style={styles.durum}>
        <Text style={styles.durumBasligi} accessibilityRole="alert">Ürünler yüklenemedi</Text>
        <Text style={styles.durumMetni}>Bağlantını kontrol edip yeniden deneyebilirsin.</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setDeneme((onceki) => onceki + 1)}
          style={({ pressed }) => [styles.buton, pressed && styles.basili]}
        >
          <Text style={styles.butonYazisi}>Tekrar Dene</Text>
        </Pressable>
      </View>
    );
  } else {
    icerik = (
      <FlatList
        data={sonuc.urunler}
        keyExtractor={(urun) => String(urun.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          sonuc.urunler.length > 0 ? (
            <View style={styles.listeBasligi}>
              {sorgu && (
                <Text accessibilityRole="header" style={styles.bolumBasligi}>
                  Arama sonuçları
                </Text>
              )}
              <Text style={styles.urunSayisi}>{sonuc.urunler.length} ürün</Text>
            </View>
          ) : undefined
        }
        ListEmptyComponent={
          <View style={styles.durum}>
            <Text style={styles.durumBasligi}>Ürün bulunamadı</Text>
            {sorgu ? <Text style={styles.durumMetni}>Başka bir kelimeyle aramayı dene.</Text> : null}
          </View>
        }
        renderItem={({ item }) => (
          <UrunKarti
            urun={item}
            onPress={() => router.push({ pathname: '/urun/[id]', params: { id: String(item.id) } })}
          />
        )}
      />
    );
  }

  return (
    <SafeAreaView style={styles.ekran} edges={['bottom', 'left', 'right']}>
      <View style={styles.icerik}>
        <View style={styles.ustAlan}>
          <View style={styles.baslikSatiri}>
            <Text accessibilityRole="header" style={styles.baslik}>E-Ticaret Mağazam</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/sepet')}
              style={({ pressed }) => [styles.buton, pressed && styles.basili]}
            >
              <Text style={styles.butonYazisi}>Sepetim ({toplamAdet})</Text>
            </Pressable>
          </View>
          <View style={styles.aramaKutusu}>
            <TextInput
              accessibilityLabel="Ürün ara"
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={setArama}
              placeholder="Ürün ara"
              placeholderTextColor="#536079"
              returnKeyType="search"
              style={styles.arama}
              value={arama}
            />
            {arama.length > 0 && (
              <Pressable
                accessibilityLabel="Aramayı temizle"
                accessibilityRole="button"
                onPress={() => setArama('')}
                style={styles.temizle}
              >
                <Text style={styles.temizleYazisi}>×</Text>
              </Pressable>
            )}
          </View>
        </View>
        {icerik}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ekran: {
    flex: 1,
    backgroundColor: '#f3f4f8',
  },
  icerik: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  ustAlan: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 14,
  },
  baslikSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  baslik: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#171f35',
  },
  buton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: '#2449ad',
  },
  butonYazisi: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  basili: {
    opacity: 0.8,
  },
  aramaKutusu: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e5ef',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  arama: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#171f35',
    fontSize: 16,
  },
  temizle: {
    width: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temizleYazisi: {
    color: '#536079',
    fontSize: 24,
  },
  liste: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  listeBasligi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 2,
    paddingBottom: 10,
  },
  bolumBasligi: {
    color: '#171f35',
    fontSize: 17,
    fontWeight: '700',
  },
  urunSayisi: {
    color: '#536079',
    fontSize: 13,
  },
  durum: {
    alignItems: 'center',
    padding: 20,
    marginTop: 24,
    gap: 10,
  },
  durumBasligi: {
    color: '#171f35',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  durumMetni: {
    color: '#536079',
    fontSize: 14,
    textAlign: 'center',
  },
});
