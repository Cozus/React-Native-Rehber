
import { StyleSheet, Text, View,TextInput,Image,ScrollView,TouchableOpacity,Linking } from 'react-native';

import React,{useState} from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function App() {

  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const scrollViewRef = useRef(null);

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
  
    return profiles.map((profile, index) => (
      <TouchableOpacity
        key={index}
        style={styles.profileButton}
        onPress={() => Linking.openURL(profile.link)}
      >
        <Text style={styles.profileButtonText}>{profile.profil_isim}</Text>
      </TouchableOpacity>
    ));
  };
  
  const Card = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>
        {item.isim} {item.soyisim ? item.soyisim : ""}
      </Text>
      {item.unvan ? (
        <Text style={{ fontSize: 12, color: "gray" }}>{item.unvan}</Text>
      ) : null}
      <View style={styles.divider} />
      {item.birim_adi ? (
        <Text style={styles.department} numberOfLines={1} ellipsizeMode="tail">Birim: <Text style={{color:"#4e73df"}} >{item.birim_adi}</Text></Text>
      ) : null}
      <View style={styles.divider} />
      {item.dahili ? (
        <Text style={styles.phone} onPress={() => Linking.openURL(`tel:${item.dahili}`)}>
          Dahili: <Text style={{color:"#4e73df"}} >{item.dahili}</Text>
        </Text>
      ) : null}
      <View style={styles.divider} />
      <View style={styles.profileButtonsContainer}>
        {renderProfileButtons(item.profiller)}
      </View>
    </View>
  );
  

  
  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef} style={styles.resultsScroll} contentContainerStyle={{ alignItems: 'center' }}>
      
    
      <View style={styles.AramaKutusu}>

      <View style={styles.header}>
        <Image style={styles.ImageStyle} source={{uri:"https://www.usak.edu.tr/Images/logolarimiz/yeni_2.png"}}></Image>
        <Text style={styles.BaslikText}>Uşak Üniversitesi Telefon Rehberi</Text>
      </View>

         <TextInput style={[styles.input, isFocused && styles.inputFocused]}
         placeholder="Arama yapmak için en az 3 harf yazınız."
         value={searchTerm}
         onChangeText={setSearchTerm}
         onFocus={() => setIsFocused(true)}
         onBlur={() => setIsFocused(false)} >
         </TextInput>

         <Text style={styles.DuzText}>Not: Arama için kişi adı, soyadı, birim adı veya dahili giriniz.</Text>
      </View>

      <View style={styles.AramaSonuc}>
  {loading ? (
    <Text style={styles.DuzText2}>Yükleniyor...</Text>
  ) : data.length > 0 ? (
    <View>
      {data.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </View>
  ) : (
    <Text style={styles.DuzText2}>
      {searchTerm.length >= 3 ? <Text style={{ color: 'red' }}>Sonuç bulunamadı.</Text> : 'Arama yapmak için yukarıya en az 3 harf yazınız.'}
    </Text>
  )}
</View>
      
      <Text style={styles.BottomText}>© 2025 Uşak Üniversitesi - Tüm Hakları Saklıdır</Text>
      <Text style={{width:'90%',paddingTop:0,fontSize:11,color:'white',textAlign:'center',padding:5,}}>Bilgi İşlem Daire Başkanlığı</Text>
      </ScrollView>

      <TouchableOpacity style={styles.scrollTopButton} onPress={scrollToTop}>
        <Text style={styles.scrollTopText}>^</Text>
      </TouchableOpacity>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#234475',
    flex:1,
    flexDirection:'column',
    alignItems:'center',
  },
  AramaKutusu:{
    width:'90%',
    height:250,
    backgroundColor:'#fff',
    borderRadius:10,
    marginTop:50,
    padding:20,
    alignItems:'center',
    justifyContent:'center',
  },
  header:{
    paddingRight:10,
    display:'flex',
    flexDirection:'row',
  },
  ImageStyle:{
    marginTop:5,
    width:20,
    height:20,
  },
  BaslikText:{
    textAlign:'center',
    fontSize:16,
    fontWeight:'300',
    color:'#234475',
  },
  input:{
    width: '100%',
    height: 70,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
    fontSize: 10,
    textAlign: 'center',
    backgroundColor: 'white',
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
  DuzText:{
    fontSize:10,
    color:'grey',
    marginTop:20,
    textAlign:'center',
  },
  AramaSonuc:{

    width:'90%',
    alignItems:'center',
    justifyContent:'center',
  },
  DuzText2:{
    marginTop:20,
    width:'95%',
    height:60,
    backgroundColor:'#fff',
    borderRadius:10,
    paddingTop:20,
    fontSize:10,
    color:'grey',
    textAlign:'center',
    alignItems:'center',
    justifyContent:'center',
  },
  BottomText:{
    width:'90%',
    paddingTop:20,
    fontSize:11,
    color:'white',
    textAlign:'center',
    padding:10,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  department: {
    fontSize: 14,
    color: 'gray',
  },
  phone: {
    fontSize: 14,
    color: 'gray',
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  profileButton: {
    backgroundColor: '#234475',
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },
  profileButtonText: {
    color: '#fff',
  },
  resultsScroll: {
    width: '100%',
    height: '100%',
    
  },
  divider: {
    height: 1.5,
    backgroundColor: 'lightgray', 
    width: 280,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 10,
    borderRadius: 10,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollTopText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
  },
});


