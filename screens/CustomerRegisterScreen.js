import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import API from '../src/api/config';
import { Ionicons } from '@expo/vector-icons';



export default function CustomerRegisterScreen({ navigation }) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    password: '',
    role: 1,
  });
  const [errors, setErrors] =useState({
  nama: '',
  email: '',
  no_hp: '',
  password: '',
});

  const handleInputChange = (field, value) => {
  setFormData(prev => ({
    ...prev,
    [field]: value,
  }));

  let error = '';

  switch (field) {
    case 'nama':
      if (!value.trim()) {
        error = 'Nama wajib diisi';
      }
      break;

    case 'email':
      if (!value.trim()) {
        error = 'Email wajib diisi';
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
      ) {
        error = 'Format email tidak valid';
      }
      break;

    case 'no_hp':
      if (!value.trim()) {
        error = 'Nomor HP wajib diisi';
      } else if (value.replace(/\D/g, '').length < 10) {
        error = 'Nomor HP tidak lengkap';
      }
      break;

    case 'password':
      if (!value) {
        error = 'Password wajib diisi';
      } else if (value.length < 8) {
        error = 'Password minimal 8 karakter';
      }
      break;
  }

  setErrors(prev => ({
    ...prev,
    [field]: error,
  }));
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.nama.trim()) {
    newErrors.nama = 'Nama wajib diisi';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email wajib diisi';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
  ) {
    newErrors.email = 'Format email tidak valid';
  }

  if (!formData.no_hp.trim()) {
    newErrors.no_hp = 'Nomor HP wajib diisi';
  } else if (formData.no_hp.replace(/\D/g, '').length < 10) {
    newErrors.no_hp = 'Nomor HP tidak lengkap';
  }

  if (!formData.password) {
    newErrors.password = 'Password wajib diisi';
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password minimal 8 karakter';
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    const res = await axios.post(API.REGISTER, formData);

    alert('Registrasi berhasil!');
    navigation.navigate('Login');

  } catch (error) {
    console.log(error.response?.data || error);
    alert('Registrasi gagal!');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/logo.jpeg')}
        style={styles.logo}
      />

      <Text style={styles.title}>Registrasi Pelanggan</Text>

      <TextInput
  placeholder="Nama Lengkap"
  style={[
    styles.input,
    errors.nama && styles.inputError,
  ]}
  value={formData.nama}
  onChangeText={(val) => handleInputChange('nama', val)}
/>

{errors.nama ? (
  <Text style={styles.errorText}>{errors.nama}</Text>
) : null}

      <TextInput
  placeholder="Email"
  keyboardType="email-address"
  autoCapitalize="none"
  style={[
    styles.input,
    errors.email && styles.inputError,
  ]}
  value={formData.email}
  onChangeText={(val) => handleInputChange('email', val)}
/>

{errors.email ? (
  <Text style={styles.errorText}>{errors.email}</Text>
) : null}

     <TextInput
  placeholder="Nomor HP"
  keyboardType="phone-pad"
  style={[
    styles.input,
    errors.no_hp && styles.inputError,
  ]}
  value={formData.no_hp}
  onChangeText={(val) => handleInputChange('no_hp', val)}
/>

{errors.no_hp ? (
  <Text style={styles.errorText}>{errors.no_hp}</Text>
) : null}

      {/* Password */}
     <View
  style={[
    styles.passwordContainer,
    errors.password && styles.inputError,
  ]}
>
  <TextInput
    placeholder="Password"
    style={styles.passwordInput}
    secureTextEntry={!showPassword}
    value={formData.password}
    onChangeText={(val) => handleInputChange('password', val)}
  />

  <TouchableOpacity
    onPress={() => setShowPassword(!showPassword)}
  >
    <Ionicons
      name={showPassword ? 'eye-off' : 'eye'}
      size={24}
      color="#777"
    />
  </TouchableOpacity>
</View>

{errors.password ? (
  <Text style={styles.errorText}>{errors.password}</Text>
) : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.loginText}>
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
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 15,
  },

  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    marginBottom: 15,
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  inputError: {
  borderColor: '#e53935',
},

errorText: {
  width: '100%',
  color: '#e53935',
  fontSize: 12,
  marginTop: -10,
  marginBottom: 10,
  marginLeft: 5,
},

  loginText: {
    color: '#007AFF',
    fontWeight: '500',
  },
});