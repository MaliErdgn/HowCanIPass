import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';

type Not = {
  id: number;
  not: number;
  katsayi: number;
}

type HarfNotu = {
  harf: string;
  gerekenFinal: string;
}

export default function App() {
  const [notlar, setNotlar] = useState<Not[]>([]);
  const [yeniNot, setYeniNot] = useState('');
  const [yeniKatsayi, setYeniKatsayi] = useState('');
  const [finalKatsayi, setFinalKatsayi] = useState('');
  const [harfNotlari, setHarfNotlari] = useState<HarfNotu[]>([]);

  const harfAraliklari = [
    { harf: 'AA', min: 90 },
    { harf: 'BA', min: 85 },
    { harf: 'BB', min: 80 },
    { harf: 'CB', min: 70 },
    { harf: 'CC', min: 60 },
    { harf: 'DC', min: 50 },
    { harf: 'DD', min: 45 },
  ];

  const notEkle = () => {
    if (yeniNot && yeniKatsayi) {
      const yeniId = notlar.length > 0 ? notlar[notlar.length - 1].id + 1 : 1;
      setNotlar([...notlar, { id: yeniId, not: parseFloat(yeniNot), katsayi: parseFloat(yeniKatsayi) }]);
      setYeniNot('');
      setYeniKatsayi('');
    }
  };

  const notSil = (id: number) => {
    setNotlar(notlar.filter((item) => item.id !== id));
  };

  const hesaplaHarfNotlari = () => {
    if (finalKatsayi && notlar.length > 0) {
      const toplamVizePuani = notlar.reduce((acc, item) => acc + item.not * item.katsayi, 0);

      const hesaplananHarfNotlari = harfAraliklari.map((harfNotu) => {
        const gerekenFinal = (harfNotu.min - toplamVizePuani) / parseFloat(finalKatsayi);
        return {
          harf: harfNotu.harf,
          gerekenFinal: gerekenFinal > 0 ? gerekenFinal.toFixed(2) : 'Yeterli',
        };
      });

      setHarfNotlari(hesaplananHarfNotlari);
    }
  };

  const temizleEkran = () => {
    setNotlar([]);
    setYeniNot('');
    setYeniKatsayi('');
    setFinalKatsayi('');
    setHarfNotlari([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.insideContainer}>
        <StatusBar backgroundColor="#121212" barStyle="light-content" />
        <Text style={styles.title}>Harf Notu Hesaplama</Text>
        <TextInput
          style={styles.input}
          placeholder="Not Girin (örn. 70)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={yeniNot}
          onChangeText={setYeniNot}
        />
        <TextInput
          style={styles.input}
          placeholder="Katsayı Girin (örn. 0.4)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={yeniKatsayi}
          onChangeText={setYeniKatsayi}
        />
        <Button title="Not Ekle" onPress={notEkle} color="#4CAF50" />
        <FlatList
          data={notlar}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                Not: {item.not} - Katsayı: {item.katsayi}
              </Text>
              <TouchableOpacity style={styles.deleteButton} onPress={() => notSil(item.id)}>
                <Text style={styles.deleteButtonText}>Sil</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TextInput
          style={styles.input}
          placeholder="Final Katsayısı (örn. 0.6)"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={finalKatsayi}
          onChangeText={setFinalKatsayi}
        />
        <Button title="Harf Notlarını Hesapla" onPress={hesaplaHarfNotlari} color="#4CAF50" />
        {harfNotlari.length > 0 && (
          <FlatList
            data={harfNotlari}
            keyExtractor={(item) => item.harf}
            renderItem={({ item }) => (
              <Text style={styles.result}>
                {item.harf}: Finalden {item.gerekenFinal} almalısınız.
              </Text>
            )}
          />
        )}
        {/* Butonlar arasında margin */}
        <View style={styles.marginTop} />
        <Button title="Ekranı Temizle" onPress={temizleEkran} color="#FF5722" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Karanlık mod arka planı
  },
  insideContainer: { flex: 1, marginHorizontal: 20, marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF', // Beyaz başlık
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888', // Gri çerçeve
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: '#FFFFFF', // Beyaz metin
    backgroundColor: '#1E1E1E', // Karanlık giriş kutusu
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E', // Karanlık liste elemanı
    marginVertical: 5,
    borderRadius: 5,
  },
  listItemText: {
    color: '#FFFFFF', // Beyaz metin
  },
  deleteButton: {
    backgroundColor: '#FF5722', // Silme butonu rengi
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF', // Beyaz metin
    fontWeight: 'bold',
  },
  result: {
    fontSize: 18,
    color: '#FFFFFF', // Beyaz sonuç metni
    padding: 10,
    backgroundColor: '#1E1E1E', // Karanlık sonuç arka planı
    marginVertical: 5,
    borderRadius: 5,
  },
  marginTop: {
    height: 20, // Harf Notlarını Hesapla ve Ekranı Temizle arasında boşluk
  },
});
