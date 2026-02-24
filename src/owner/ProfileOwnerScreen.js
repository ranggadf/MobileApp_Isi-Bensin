import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import OwnerBottomNav from "../component/OwnerBottomNav";

/* ================= AXIOS CONFIG ================= */
import axiosInstance from "../api/AxiosInstance";

export default function ProfileOwnerScreen() {
  const navigation = useNavigation();

  const [owner, setOwner] = useState(null);
  const [warungExists, setWarungExists] = useState(false);

  const [namaWarung, setNamaWarung] = useState("");
  const [alamatWarung, setAlamatWarung] = useState("");
  const [stokPertalite, setStokPertalite] = useState("");
  const [stokPertamax, setStokPertamax] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [foto, setFoto] = useState(null);

  const [loadingLokasi, setLoadingLokasi] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadOwner();
    loadWarung();
  }, []);

 const loadOwner = async () => {
  try {
    const res = await axiosInstance.get("/user");

    console.log("DATA USER:", res.data);

    const user = res.data.data ? res.data.data : res.data;

    setOwner(user);
  } catch (error) {
    console.log("Gagal ambil data owner");
  }
};

  const loadWarung = async () => {
  try {
    const res = await axiosInstance.get("/warung");

    console.log("DATA WARUNG:", res.data);

    // Jika backend kirim { data: {...} }
    const warung = res.data.data ? res.data.data : res.data;

    if (warung) {
      setWarungExists(true);
      setNamaWarung(warung.nama_warung || "");
      setAlamatWarung(warung.alamat || "");
      setStokPertalite(
        warung.stok_pertalite ? String(warung.stok_pertalite) : ""
      );
      setStokPertamax(
        warung.stok_pertamax ? String(warung.stok_pertamax) : ""
      );
      setLatitude(warung.latitude || null);
      setLongitude(warung.longitude || null);
      setFoto(warung.foto || null);
    } else {
      setWarungExists(false);
    }
  } catch (error) {
    console.log("Warung belum ada atau belum login");
    setWarungExists(false);
  }
};
  /* ================= FOTO ================= */
  const pilihFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  /* ================= LOKASI ================= */
  const ambilLokasiWarung = async () => {
    setLoadingLokasi(true);

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Izin lokasi ditolak");
      setLoadingLokasi(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    setLoadingLokasi(false);
  };

  /* ================= SIMPAN ================= */
const simpanWarung = async () => {
  if (!namaWarung || !alamatWarung) {
    Alert.alert("Nama dan alamat wajib diisi");
    return;
  }

  const formData = new FormData();

  formData.append("nama_warung", namaWarung);
  formData.append("alamat", alamatWarung);
  formData.append("stok_pertalite", stokPertalite);
  formData.append("stok_pertamax", stokPertamax);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  if (foto?.uri) {
    formData.append("foto", {
      uri: foto.uri,
      name: "warung.jpg",
      type: "image/jpeg",
    });
  }

  try {
    if (warungExists) {
      await axiosInstance.post("/warung?_method=PUT", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Warung berhasil diupdate");
    } else {
      await axiosInstance.post("/warung", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Warung berhasil dibuat");
    }

    // 🔥 reload data setelah simpan
    loadWarung();

  } catch (error) {
    console.log(error.response?.data);
    Alert.alert("Gagal menyimpan");
  }
};

  /* ================= LOGOUT ================= */
 const handleLogout = async () => {
  await AsyncStorage.clear();
  navigation.replace("Login");
};

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Owner</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* DATA OWNER */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Owner</Text>

          {owner && (
            <>
              <Text style={styles.label}>Nama</Text>
              <Text style={styles.value}>{owner.nama}</Text>

              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{owner.email}</Text>
            </>
          )}
        </View>

        {/* DATA WARUNG */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Warung</Text>

          {foto && (
            <Image
              source={{
                uri: foto.uri
                  ? foto.uri
                  : `http://192.168.1.6:8000/storage/${foto}`,
              }}
              style={styles.image}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={pilihFoto}>
            <Text style={styles.buttonText}>Pilih Foto</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Nama Warung"
            value={namaWarung}
            onChangeText={setNamaWarung}
          />

          <TextInput
            style={styles.input}
            placeholder="Alamat"
            value={alamatWarung}
            onChangeText={setAlamatWarung}
          />

          <TouchableOpacity
            style={styles.locationButton}
            onPress={ambilLokasiWarung}
          >
            {loadingLokasi ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Ambil Lokasi</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.smallText}>
            Lat: {latitude || "-"} | Long: {longitude || "-"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Stok Pertalite"
            keyboardType="numeric"
            value={stokPertalite}
            onChangeText={setStokPertalite}
          />

          <TextInput
            style={styles.input}
            placeholder="Stok Pertamax"
            keyboardType="numeric"
            value={stokPertamax}
            onChangeText={setStokPertamax}
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

      {/* BOTTOM NAV */}
      <OwnerBottomNav navigation={navigation} active="Profile" />
    </SafeAreaView>
  );
}

/* ================= STYLE ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },

  label: { color: "#888", marginTop: 10 },
  value: { fontWeight: "bold", marginBottom: 10 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#9B59B6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  locationButton: {
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
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
  smallText: { fontSize: 12, marginBottom: 15 },
});