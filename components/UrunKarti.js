import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

/** @param {{ urun: import('../context/SepetContext').Urun, onPress: () => void }} props */
export default function UrunKarti({ urun, onPress }) {
  const fiyat = `$${urun.price.toFixed(2)}`;

  return (
    <Pressable
      accessibilityLabel={`${urun.title}, ${fiyat}, puan ${urun.rating}`}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.kart, pressed && styles.basili]}
    >
      <View style={styles.resimAlani}>
        <Image accessible={false} resizeMode="contain" source={{ uri: urun.thumbnail }} style={styles.resim} />
      </View>
      <View style={styles.bilgiler}>
        <Text style={styles.baslik}>{urun.title}</Text>
        <View style={styles.urunBilgisi}>
          <Text style={styles.fiyat}>{fiyat}</Text>
          <Text style={styles.puan}>★ {urun.rating}</Text>
        </View>
      </View>
      <Text accessible={false} importantForAccessibility="no" style={styles.ok}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e5ef',
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  basili: {
    backgroundColor: '#edf1fd',
  },
  resimAlani: {
    width: 82,
    height: 82,
    padding: 5,
    borderRadius: 11,
    backgroundColor: '#f3f4f8',
  },
  resim: {
    width: '100%',
    height: '100%',
  },
  bilgiler: {
    flex: 1,
    gap: 7,
  },
  baslik: {
    fontSize: 16,
    fontWeight: '700',
    color: '#171f35',
  },
  urunBilgisi: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 9,
  },
  fiyat: {
    fontSize: 17,
    color: '#2449ad',
    fontWeight: '800',
  },
  puan: {
    fontSize: 13,
    color: '#75520d',
    fontWeight: '700',
  },
  ok: {
    color: '#536079',
    fontSize: 25,
    marginRight: 3,
  },
});
