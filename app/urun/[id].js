import { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSepet } from '../../context/SepetContext';

/** @type {Record<string, string>} */
const kategoriler = {
  beauty: 'Kozmetik',
  fragrances: 'Parfüm',
  furniture: 'Mobilya',
  groceries: 'Market',
  smartphones: 'Akıllı telefon',
};

/** @typedef {{ id: string, istek: number, urun?: import('../../context/SepetContext').Urun, hata?: string }} DetaySonucu */

export default function UrunDetay() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const router = useRouter();
  const { sepeteEkle } = useSepet();
  const [istek, setIstek] = useState(0);
  const [durum, setDurum] = useState(/** @type {DetaySonucu | null} */ (null));
  const gecerliId = /^[1-9]\d*$/.test(id);
  const guncel = durum && durum.id === id && durum.istek === istek;
  const urun = guncel ? durum.urun : null;
  const hata = guncel ? durum.hata : '';

  useEffect(() => {
    if (!gecerliId) return;

    const controller = new AbortController();

    async function urunuGetir() {
      try {
        const cevap = await fetch(`https://dummyjson.com/products/${id}`, {
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        if (cevap.status === 404) {
          setDurum({ id, istek, hata: 'Ürün bulunamadı.' });
          return;
        }

        if (!cevap.ok) throw new Error('Ürün isteği başarısız oldu.');

        const veri = await cevap.json();
        if (!controller.signal.aborted) setDurum({ id, istek, urun: veri });
      } catch {
        if (!controller.signal.aborted) {
          setDurum({ id, istek, hata: 'Ürün bilgisi yüklenemedi.' });
        }
      }
    }

    urunuGetir();
    return () => controller.abort();
  }, [gecerliId, id, istek]);

  const indirim = urun?.discountPercentage ?? 0;
  const indirimliFiyat = urun ? urun.price * (1 - indirim / 100) : 0;

  return (
    <>
      <Stack.Screen options={{ title: urun?.title ?? 'Ürün Detayı' }} />
      <SafeAreaView style={styles.ekran} edges={['left', 'right', 'bottom']}>
        {!gecerliId || hata ? (
          <View style={styles.durum}>
            <Text style={styles.hata}>{gecerliId ? hata : 'Ürün bulunamadı.'}</Text>
            {gecerliId && (
              <Pressable
                accessibilityRole="button"
                style={styles.buton}
                onPress={() => setIstek((onceki) => onceki + 1)}
              >
                <Text style={styles.butonYazi}>Tekrar dene</Text>
              </Pressable>
            )}
          </View>
        ) : urun ? (
          <ScrollView contentContainerStyle={styles.icerik}>
            <View style={styles.gorselAlani}>
              <Image
                accessible
                accessibilityLabel={urun.title}
                source={{ uri: urun.images?.[0] || urun.thumbnail }}
                style={styles.gorsel}
                resizeMode="contain"
              />
            </View>
            <View style={styles.bilgiler}>
              <View style={styles.ozellikler}>
                <Text style={styles.kategori}>
                  {kategoriler[urun.category] || urun.category.replace(/-/g, ' ')}
                </Text>
                <Text style={styles.puan}>★ {urun.rating.toFixed(2)} / 5</Text>
              </View>
              <Text accessibilityRole="header" style={styles.baslik}>{urun.title}</Text>
              <View style={styles.fiyatSatiri}>
                <Text style={styles.fiyat}>${indirimliFiyat.toFixed(2)}</Text>
                {indirim > 0 && (
                  <>
                    <Text style={styles.eskiFiyat}>${urun.price.toFixed(2)}</Text>
                    <Text style={styles.indirim}>%{indirim.toLocaleString('tr-TR')} indirim</Text>
                  </>
                )}
              </View>
              <View style={styles.aciklamaAlani}>
                <Text accessibilityRole="header" style={styles.altBaslik}>Ürün Açıklaması</Text>
                <Text style={styles.aciklama}>{urun.description}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                style={({ pressed }) => [styles.buton, pressed && styles.basili]}
                onPress={() => {
                  sepeteEkle(urun);
                  router.push('/sepet');
                }}
              >
                <Text style={styles.butonYazi}>Sepete Ekle</Text>
              </Pressable>
            </View>
          </ScrollView>
        ) : (
          <ActivityIndicator accessibilityLabel="Ürün yükleniyor" color="#2449ad" size="large" style={styles.yukleme} />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  ekran: { flex: 1, backgroundColor: '#f3f4f8' },
  icerik: { alignSelf: 'center', width: '100%', maxWidth: 560, padding: 16, gap: 12 },
  gorselAlani: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 218,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e5ef',
  },
  gorsel: { width: '88%', height: '88%' },
  bilgiler: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e0e5ef',
    padding: 16,
    gap: 12,
  },
  ozellikler: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  kategori: { color: '#536079', fontSize: 14, fontWeight: '600', textTransform: 'capitalize' },
  puan: { color: '#795108', fontSize: 14, fontWeight: '700' },
  baslik: { color: '#171f35', fontSize: 25, fontWeight: '800' },
  fiyatSatiri: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  fiyat: { color: '#2449ad', fontSize: 24, fontWeight: '800' },
  eskiFiyat: { color: '#536079', fontSize: 15, textDecorationLine: 'line-through' },
  indirim: { color: '#176048', backgroundColor: '#e7f5ee', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7, fontWeight: '700' },
  aciklamaAlani: { borderTopWidth: 1, borderColor: '#e0e5ef', paddingTop: 12, gap: 5 },
  altBaslik: { color: '#171f35', fontSize: 16, fontWeight: '700' },
  aciklama: { color: '#536079', fontSize: 14, lineHeight: 21 },
  buton: { minHeight: 48, justifyContent: 'center', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, backgroundColor: '#2449ad' },
  butonYazi: { color: '#ffffff', fontWeight: '700', fontSize: 15 },
  basili: { opacity: 0.85 },
  yukleme: { flex: 1 },
  durum: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12, padding: 24 },
  hata: { color: '#a52837', fontSize: 16, textAlign: 'center' },
});
