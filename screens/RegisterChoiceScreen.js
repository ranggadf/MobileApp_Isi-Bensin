import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function RegisterChoiceScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo Aplikasi */}
      <Image 
        source={require('../assets/logo.jpeg')} // nanti ganti sesuai logo kamu
        style={styles.logo}
      />

      <Text style={styles.title}>Daftar Sebagai</Text>
      

      {/* Button Pelanggan */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('RegisterPelanggan')}
      >
        <Text style={styles.buttonText}>Registrasi Pelanggan</Text>
      </TouchableOpacity>

      {/* Button Pemilik Warung */}
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#1f7a1f' }]}
        onPress={() => navigation.navigate('RegisterPemilik')}
      >
        <Text style={styles.buttonText}>Registrasi Pemilik Warung</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff'
  },
  logo: {
    width: 240,
    height: 240,
    marginBottom: 40,
    resizeMode: 'contain'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30
  },
  button: {
    width: '75%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    marginVertical: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
