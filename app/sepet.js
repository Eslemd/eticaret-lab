import React from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { useSepet } from '../context/SepetContext';

export default function SepetSayfasi() {
  const router = useRouter();
  const { sepet, toplamAdet, toplamTutar, adetArtir, adetAzalt, sepettenSil } = useSepet();

  function alisveriseDon() {
    router.dismissTo('/');
  }

  /** @param {import('react-native').ListRenderItemInfo<import('../context/SepetContext').SepetUrunu>} bilgi */
  function sepetUrunuGoster({ item }) {
    const enAzAdet = item.adet === 1;

    return (
      <View style={styles.kart}>
        <View style={styles.urunSatiri}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.resim}
            resizeMode="contain"
            accessible={false}
          />
          <View style={styles.urunBilgileri}>
            <Text style={styles.urunAdi}>{item.title}</Text>
            <Text style={styles.birimFiyat}>Birim fiyat ${item.price.toFixed(2)}</Text>
            <Text style={styles.urunTutari}>${(item.price * item.adet).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.kartIslemleri}>
          <View style={styles.adetAlani}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.title} ürününün adedini azalt`}
              accessibilityState={{ disabled: enAzAdet }}
              disabled={enAzAdet}
              onPress={() => adetAzalt(item.id)}
              style={[styles.adetButonu, enAzAdet && styles.adetButonuPasif]}
            >
              <Text style={styles.adetButonYazisi}>−</Text>
            </Pressable>
            <Text accessibilityLabel={`${item.adet} adet`} style={styles.adet}>
              {item.adet}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.title} ürününün adedini artır`}
              onPress={() => adetArtir(item.id)}
              style={styles.adetButonu}
            >
              <Text style={styles.adetButonYazisi}>+</Text>
            </Pressable>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.title} ürününü sepetten sil`}
            onPress={() => sepettenSil(item.id)}
            style={styles.silButonu}
          >
            <Text style={styles.silYazisi}>Ürünü Sil</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.ekran} edges={['bottom', 'left', 'right']}>
      <View style={styles.icerik}>
        {sepet.length === 0 ? (
          <View style={styles.bosSepet}>
            <Text style={styles.bosBaslik}>Sepetiniz boş.</Text>
            <Text style={styles.bosAciklama}>Ürünleri inceleyip sepetinize ekleyebilirsiniz.</Text>
            <Pressable accessibilityRole="button" style={styles.anaButon} onPress={alisveriseDon}>
              <Text style={styles.anaButonYazisi}>Alışverişe Dön</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.urunSayisi} accessibilityLiveRegion="polite">
              Sepette {toplamAdet} ürün
            </Text>
            <FlatList
              data={sepet}
              keyExtractor={(item) => String(item.id)}
              renderItem={sepetUrunuGoster}
              contentContainerStyle={styles.liste}
            />
            <View style={styles.ozet}>
              <View style={styles.toplamSatiri}>
                <Text style={styles.toplamEtiketi}>Sepet toplamı</Text>
                <Text style={styles.toplamTutar} accessibilityLiveRegion="polite">
                  ${toplamTutar.toFixed(2)}
                </Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.anaButon} onPress={alisveriseDon}>
                <Text style={styles.anaButonYazisi}>Alışverişe Devam Et</Text>
              </Pressable>
            </View>
          </>
        )}
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
    alignSelf: 'center',
    width: '100%',
    maxWidth: 640,
  },
  urunSayisi: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: '#536079',
    fontSize: 15,
    fontWeight: '600',
  },
  liste: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  kart: {
    backgroundColor: '#ffffff',
    borderColor: '#e0e5ef',
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    gap: 12,
  },
  urunSatiri: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resim: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#f3f4f8',
  },
  urunBilgileri: {
    flex: 1,
    gap: 4,
  },
  urunAdi: {
    color: '#171f35',
    fontSize: 16,
    fontWeight: '700',
  },
  birimFiyat: {
    color: '#536079',
    fontSize: 14,
  },
  urunTutari: {
    color: '#2449ad',
    fontSize: 17,
    fontWeight: '700',
  },
  kartIslemleri: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e5ef',
    paddingTop: 10,
  },
  adetAlani: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adetButonu: {
    backgroundColor: '#edf1ff',
    borderRadius: 10,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adetButonuPasif: {
    opacity: 0.45,
  },
  adetButonYazisi: {
    color: '#2449ad',
    fontSize: 20,
    fontWeight: '700',
  },
  adet: {
    color: '#171f35',
    minWidth: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  silButonu: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  silYazisi: {
    color: '#a23443',
    fontSize: 14,
    fontWeight: '600',
  },
  ozet: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopColor: '#e0e5ef',
    borderTopWidth: 1,
    gap: 14,
  },
  toplamSatiri: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  toplamEtiketi: {
    color: '#171f35',
    fontSize: 16,
    fontWeight: '600',
  },
  toplamTutar: {
    color: '#171f35',
    fontSize: 24,
    fontWeight: '800',
  },
  bosSepet: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  bosBaslik: {
    color: '#171f35',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  bosAciklama: {
    color: '#536079',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 6,
  },
  anaButon: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#2449ad',
    alignItems: 'center',
    justifyContent: 'center',
  },
  anaButonYazisi: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
