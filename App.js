import {Alert, StyleSheet, Text, View, TextInput, Image, ScrollView, TouchableOpacity, Linking, Dimensions } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useFonts } from 'expo-font';
import theme from './theme';


const screenWidth = Dimensions.get('window').width;
const componentWidth = screenWidth * 0.9;

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef(null);

  const [fontsLoaded] = useFonts({
    'akad': require('./assets/fonts/akademik.ttf'),
    "Oxygen": require('./assets/fonts/Oxygen-Regular.ttf'),
    "Oxygen-Bold": require('./assets/fonts/Oxygen-Bold.ttf'),
  });


  const profileIcons = {
    orcid: '',
    yokakademik: '',
    trdizin: '',
    googlescholar: '',
    researchgate: '',
    researcherid: '',
    scopusid: '',
  };

  if (!fontsLoaded) {
    
  }

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      setLoading(true);
      fetch(`https://rehber.usak.edu.tr/api/rehber?ara=${searchTerm}`)
        .then(response => response.json())
        .then(json => {
          setData(json.data || []);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setData([]);
    }
  }, [searchTerm]);

  const renderProfileButtons = (profiles) => {
    if (!profiles || profiles.length === 0) {
      return null;
    }
    return profiles.map((profile, index) => {
      const icon = profileIcons[profile.profil.toLowerCase()] || '❓';
      return (
        <TouchableOpacity
        key={index}
        style={styles.profileButton}
        onPress={() => {
          if (profile.link && profile.link.trim() !== '') {
            Linking.openURL(profile.link);
          } else {
            Alert.alert('Hata', 'Profil bulunamadı'); 
          }
        }}
      >
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
          <Text style={styles.profileButtonText}>{icon}</Text>
        </View>
      </TouchableOpacity>
      );
    });
  };

  const Card = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.isim} {item.soyisim ? item.soyisim : ""}
      </Text>
      {item.unvan ? (
        <Text style={{ fontSize: 14, color: "gray" , fontFamily:"Oxygen", }}>{item.unvan}</Text>
      ) : null}
      <View style={styles.divider} />
      {item.birim_adi ? (
        <Text style={styles.department} onPress={() => Linking.openURL(`https://${item.subdomain}.usak.edu.tr`)}>
          Birim: <Text style={{ color: "#3D7FBF" }}>{item.birim_adi}</Text>
        </Text>
      ) : null}
      <View style={styles.divider} />
      {item.dahili ? (
        <Text style={styles.phone} onPress={() => Linking.openURL(`tel:${item.dahili}`)}>
          Dahili: <Text style={{ color: "#3D7FBF" }}>{item.dahili}</Text>
        </Text>
      ) : null}
      <View style={styles.divider} />
      <View style={styles.profileButtonsContainer}>
        {item.profiller && item.profiller.length > 0 ? renderProfileButtons(item.profiller) : null}
        {item.profiller && item.profiller.length > 0 ? (
          <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }} onPress={() => Linking.openURL(`https://avesis.usak.edu.tr/${item.kullanici_adi}`)}>
            
            <Text style={styles.profileButtonText}></Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.resultsScroll} contentContainerStyle={{ alignItems: 'center' }}>
        <View style={styles.AramaKutusu}>
          <View style={styles.header}>
            <Text style={styles.BaslikText}><Text style={{fontFamily:"akad"}}></Text> Uşak Üniversitesi Telefon Rehberi</Text>
          </View>
          <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder="Arama yapmak için en az 3 harf yazınız."
            value={searchTerm}
            onChangeText={setSearchTerm}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles.DuzText}>Not: Arama için kişi adı, soyadı, birim adı veya dahili giriniz.</Text>
        </View>
        <View style={styles.AramaSonuc}>
          {loading ? (
            <View style={styles.messageContainer}>
              <Text style={styles.DuzText2}>Yükleniyor...</Text>
            </View>
          ) : data.length > 0 ? (
            <View>
              {data.map((item, index) => (
                <Card key={index} item={item} />
              ))}
            </View>
          ) : (
            <View style={styles.messageContainer}>
              <Text style={styles.DuzText2}>
                {searchTerm.length >= 3 ? 
                  <Text style={styles.noResultsText}>Sonuç bulunamadı.</Text> : 
                  'Arama yapmak için yukarıya en az 3 harf yazınız.'
                }
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.BottomText}>© 2025 Uşak Üniversitesi - Tüm Hakları Saklıdır</Text>
        <Text style={{ width: '90%', paddingTop: 0, color: 'white', textAlign: 'center', padding: 5,fontFamily:"Oxygen", }}>
          Bilgi İşlem Daire Başkanlığı
        </Text>
      </ScrollView>
      <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
        <Text style={styles.scrollTopText}>ᐃ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.koyuMavi,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  AramaKutusu: {
    width: componentWidth,
    height: 250,
    backgroundColor: theme.colors.beyaz,
    borderRadius: 10,
    marginTop: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  BaslikText: {
    textAlign: 'center',
    fontFamily: 'Oxygen',
    fontSize: 20,
    color: theme.colors.koyuMavi,
  },
  input: {
    width: '100%',
    height: 70,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
    fontFamily:"Oxygen",
    backgroundColor: theme.colors.beyaz,
  },
  inputFocused: {
    borderColor: 'lightblue',
    borderWidth: 3,
    shadowColor: 'lightblue',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  DuzText: {
    fontSize: 14,
    color: theme.colors.koyuGri,
    marginTop: 20,
    textAlign: 'center',
    fontFamily:"Oxygen",
  },
  AramaSonuc: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageContainer: {
    marginTop:10,
    width: '90%',
    height: 80,
    backgroundColor: theme.colors.beyaz,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding:10,
  },
  DuzText2: {
    fontSize: 14,
    color: theme.colors.koyuGri,
    textAlign: 'center',
    fontFamily:"Oxygen",
  },
  noResultsText: {
    color: theme.colors.acikKirmizi,
    fontFamily:"Oxygen",
  },
  BottomText: {
    width: '90%',
    paddingTop: 20,
    fontSize: 14,
    color: theme.colors.beyaz,
    textAlign: 'center',
    padding: 10,
    fontFamily:"Oxygen",
  },
  card: {
    width: componentWidth,
    height: 'auto',
    backgroundColor: theme.colors.beyaz,
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontFamily:"Oxygen-Bold",
    color: theme.colors.koyuGri,
  },
  department: {
    fontSize: 14,
    color: theme.colors.koyuGri,
    fontFamily:"Oxygen",
  },
  phone: {
    fontSize: 14,
    color: theme.colors.koyuGri,
    fontFamily:"Oxygen",
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: "flex-end",
    alignItems: 'center',
    textAlign: 'center',
    gap: 5,
  },
  profileButton: {
    padding: 5,
    margin: 1,
  },
  profileButtonText: {
    color: theme.colors.acikMavi,
    fontFamily: "akad",
    fontSize: 16,
  },
  resultsScroll: {
    width: '100%',
    height: '100%',
  },
  divider: {
    height: 1.5,
    backgroundColor: theme.colors.acikGri,
    width: "100%",
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollTopText: {
    color: theme.colors.beyaz,
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
  },
});