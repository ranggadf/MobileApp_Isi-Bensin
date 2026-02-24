import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import API from '../src/api/config'; // sesuaikan path

export default function OwnerRegisterScreen({ navigation }) {

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    no_hp: "",
    password: "",
    role: 2 // pemilik warung
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nama || !formData.email || !formData.no_hp || !formData.password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const res = await axios.post(API.REGISTER, formData);
      console.log("Response API:", res.data);

      alert("Registrasi berhasil, silakan login!");
      navigation.navigate("Login");

    } catch (error) {
      console.log(error.response ? error.response.data : error);
      alert("Registrasi gagal, cek kembali data!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Image source={require('../assets/logo.png')} style={styles.logo} />

      <Text style={styles.title}>Registrasi Pemilik Warung</Text>

      <TextInput
        placeholder="Nama Lengkap"
        style={styles.input}
        value={formData.nama}
        onChangeText={(val) => handleInputChange('nama', val)}
      />

      <TextInput
        placeholder="Email"
        style={styles.input}
        value={formData.email}
        keyboardType="email-address"
        onChangeText={(val) => handleInputChange('email', val)}
      />

      <TextInput
        placeholder="Nomor HP"
        style={styles.input}
        value={formData.no_hp}
        keyboardType="phone-pad"
        onChangeText={(val) => handleInputChange('no_hp', val)}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={formData.password}
        onChangeText={(val) => handleInputChange('password', val)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Text style={{ color: '#007AFF', fontWeight: '500' }}>
          Sudah punya akun? Masuk
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 180,
    height: 180,
    marginTop: 30,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
