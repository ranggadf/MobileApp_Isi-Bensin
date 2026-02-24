import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/config";

export default function ProfileOwnerScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [namaWarung, setNamaWarung] = useState("");
  const [alamatWarung, setAlamatWarung] = useState("");
  const [stokPertalite, setStokPertalite] = useState("");
  const [stokPertamax, setStokPertamax] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [warungExists, setWarungExists] = useState(false);

  // ===============================
  // 🔵 LOAD DATA WARUNG SAAT BUKA
  // ===============================
  useEffect(() => {
    loadWarung();
  }, []);

  const loadWarung = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(API.WARUNG, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.data) {
        setWarungExists(true);
        setNamaWarung(res.data.nama_warung || "");
        setAlamatWarung(res.data.alamat || "");
        setStokPertalite(String(res.data.stok_pertalite || ""));
        setStokPertamax(String(res.data.stok_pertamax || ""));
        setLatitude(String(res.data.latitude || ""));
        setLongitude(String(res.data.longitude || ""));
      }
    } catch (error) {
      console.log("Warung belum ada");
    }
  };

  // ===============================
  // 🟢 SIMPAN / UPDATE WARUNG
  // ===============================
  const simpanWarung = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (
        !namaWarung ||
        !alamatWarung ||
        !latitude ||
        !longitude ||
        !stokPertalite ||
        !stokPertamax
      ) {
        Alert.alert("Error", "Semua data wajib diisi");
        return;
      }

      const data = {
        nama_warung: namaWarung,
        alamat: alamatWarung,
        latitude: latitude,
        longitude: longitude,
        stok_pertalite: Number(stokPertalite),
        stok_pertamax: Number(stokPertamax),
      };

      if (warungExists) {
        await axios.put(API.WARUNG, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        Alert.alert("Sukses", "Warung berhasil diupdate");
      } else {
        await axios.post(API.WARUNG, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        Alert.alert("Sukses", "Warung berhasil dibuat");
        setWarungExists(true);
      }
    } catch (error) {
      console.log(error.response?.data || error);
      Alert.alert("Error", "Gagal menyimpan warung");
    }
  };

  // ===============================
  // 🔴 LOGOUT
  // ===============================
  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.replace("Login");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile Owner</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Nama Warung</Text>
          <TextInput
            style={styles.input}
            value={namaWarung}
            onChangeText={setNamaWarung}
          />

          <Text style={styles.label}>Alamat</Text>
          <TextInput
            style={styles.input}
            value={alamatWarung}
            onChangeText={setAlamatWarung}
          />

          <Text style={styles.label}>Latitude</Text>
          <TextInput
            style={styles.input}
            value={latitude}
            onChangeText={setLatitude}
          />

          <Text style={styles.label}>Longitude</Text>
          <TextInput
            style={styles.input}
            value={longitude}
            onChangeText={setLongitude}
          />

          <Text style={styles.label}>Stok Pertalite</Text>
          <TextInput
            style={styles.input}
            value={stokPertalite}
            onChangeText={setStokPertalite}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Stok Pertamax</Text>
          <TextInput
            style={styles.input}
            value={stokPertamax}
            onChangeText={setStokPertamax}
            keyboardType="numeric"
          />

          <TouchableOpacity style={styles.saveButton} onPress={simpanWarung}>
            <Text style={styles.buttonText}>
              {warungExists ? "Update Warung" : "Buat Warung"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1520" },
  content: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#2A2F3A",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  label: { color: "#aaa", marginBottom: 5 },
  input: {
    backgroundColor: "#1B202B",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: "#fff",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});