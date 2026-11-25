import React, { createContext, useContext, useState } from 'react';

/**
 * @typedef {object} Urun
 * @property {number} id
 * @property {string} title
 * @property {number} price
 * @property {number} rating
 * @property {string} thumbnail
 * @property {string} category
 * @property {string} description
 * @property {string[]} [images]
 * @property {number} [discountPercentage]
 */
/** @typedef {Urun & { adet: number }} SepetUrunu */
/**
 * @typedef {object} SepetDurumu
 * @property {SepetUrunu[]} sepet
 * @property {number} toplamAdet
 * @property {number} toplamTutar
 * @property {(urun: Urun) => void} sepeteEkle
 * @property {(id: number) => void} sepettenSil
 * @property {(id: number) => void} adetArtir
 * @property {(id: number) => void} adetAzalt
 */

const SepetContext = createContext(/** @type {SepetDurumu | null} */ (null));

/** @param {{ children: React.ReactNode }} props */
export function SepetProvider({ children }) {
  const [sepet, setSepet] = useState(/** @type {SepetUrunu[]} */ ([]));

  /** @param {Urun} urun */
  function sepeteEkle(urun) {
    setSepet((oncekiSepet) => {
      const mevcutUrun = oncekiSepet.find((item) => item.id === urun.id);
      if (mevcutUrun) {
        return oncekiSepet.map((item) =>
          item.id === urun.id ? { ...item, adet: item.adet + 1 } : item
        );
      }

      return [...oncekiSepet, { ...urun, adet: 1 }];
    });
  }

  /** @param {number} id */
  function sepettenSil(id) {
    setSepet((oncekiSepet) => oncekiSepet.filter((item) => item.id !== id));
  }

  /** @param {number} id */
  function adetArtir(id) {
    setSepet((oncekiSepet) =>
      oncekiSepet.map((item) =>
        item.id === id ? { ...item, adet: item.adet + 1 } : item
      )
    );
  }

  /** @param {number} id */
  function adetAzalt(id) {
    setSepet((oncekiSepet) =>
      oncekiSepet.map((item) =>
        item.id === id && item.adet > 1 ? { ...item, adet: item.adet - 1 } : item
      )
    );
  }

  const toplamAdet = sepet.reduce((toplam, item) => toplam + item.adet, 0);
  const toplamTutar = sepet.reduce((toplam, item) => toplam + item.price * item.adet, 0);

  return (
    <SepetContext.Provider
      value={{ sepet, toplamAdet, toplamTutar, sepeteEkle, adetArtir, adetAzalt, sepettenSil }}
    >
      {children}
    </SepetContext.Provider>
  );
}

export function useSepet() {
  const sepetDurumu = useContext(SepetContext);

  if (!sepetDurumu) {
    throw new Error('useSepet, SepetProvider içinde kullanılmalıdır.');
  }

  return sepetDurumu;
}
