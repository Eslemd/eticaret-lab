# E-Ticaret Mağazam

Mobil Programlama dersi Hafta 10 laboratuvarı için Expo SDK 58, React Native, Expo Router ve JavaScript ile geliştirilen üç ekranlı uygulama. Ürün verileri ve görseller [DummyJSON Ürün API’sinden](https://dummyjson.com/docs/products) gelir.

Projenin başlangıç şablonu laboratuvar föyündeki `npx create-expo-app@latest eticaret-lab --template blank` komutuyla oluşturuldu. Ekranlar `app/` klasöründen Expo Router ile açılır.

## Kurulum ve çalıştırma

Node.js LTS ve npm ile proje klasöründe şu komutları çalıştırın:

```sh
npm ci
npx expo start --go --clear
```

Telefonu bilgisayarla aynı ağa bağlayın ve terminaldeki QR kodu SDK 58 ile uyumlu Expo Go uygulamasında açın. Tarayıcıda önizlemek için `npm run web`, kod denetimi için `npm run lint` çalıştırılabilir.

## Uygulama akışı

| Ekran | İçerik |
| --- | --- |
| Ürünler (`/`) | İlk 20 ürünün görseli, adı, fiyatı ve puanı. Arama kutusu API üzerinden filtreler. Sepet düğmesi ürün adetlerinin toplamını gösterir. |
| Ürün Detayı (`/urun/[id]`) | Seçili ürünün görseli, kategorisi, puanı ve açıklaması. İndirim oranından hesaplanan tutar, normal fiyatla birlikte gösterilir. Sepete Ekle düğmesi ürünü ekler ve sepeti açar. |
| Sepetim (`/sepet`) | Ürünleri artırma, azaltma ve silme kontrolleri, satır tutarları ve toplam. Aynı ürün tekrar eklendiğinde aynı satırdaki adedi artar. |

Liste `GET /products?limit=20`, detay `GET /products/{id}` ve arama `GET /products/search?q=...` uç noktalarını kullanır. Liste ve detay ekranlarında yüklenme ve hata durumları gösterilir. Ürün kartı, veriyi `props` üzerinden alır. `SepetProvider`, üç ekranın ortak sepet durumunu `useSepet` ve `useContext` üzerinden paylaşır. Sepet uygulama belleğinde tutulur ve yeniden başlatıldığında boşalır. Sepet toplamı laboratuvar yönergesindeki gibi normal ürün fiyatlarıyla hesaplanır.

## Dosyalar

- `app/_layout.js` — Expo Router ekranları ve ortak sepet sağlayıcısı
- `app/index.js` — Ürün listesi, arama ve sepet adedi
- `app/urun/[id].js` — Dinamik ürün detayı ve sepete ekleme
- `app/sepet.js` — Sepet listesi ve adet kontrolleri
- `components/UrunKarti.js` — Yeniden kullanılabilir ürün kartı
- `context/SepetContext.js` — Sepet işlemleri ve toplam hesapları
