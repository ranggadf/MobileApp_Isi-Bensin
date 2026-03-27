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
import OwnerBottomNav from "../component/OwnerBottomNav";
import axiosInstance from "../api/AxiosInstance";

export default function ProfileOwnerScreen() {
  const navigation = useNavigation();

  const [owner, setOwner] = useState(null);
  const [warungExists, setWarungExists] = useState(false);

  const [namaWarung, setNamaWarung] = useState("");
  const [alamatWarung, setAlamatWarung] = useState("");

  const [stokPertalite, setStokPertalite] = useState("");
  const [stokPertamax, setStokPertamax] = useState("");

  const [hargaPertalite, setHargaPertalite] = useState("");
  const [hargaPertamax, setHargaPertamax] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [foto, setFoto] = useState(null);

  const [loadingLokasi, setLoadingLokasi] = useState(false);

  const imageUrl =
    foto?.uri
      ? foto.uri
      : foto
      ? `http://192.168.1.11:8000/storage/${foto}`
      : null;

  useEffect(() => {
    loadOwner();
    loadWarung();
    requestPermission();
  }, []);

  const requestPermission = async () => {
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  };

  const loadOwner = async () => {
    try {
      const res = await axiosInstance.get("/user");
      const user = res.data.data ? res.data.data : res.data;
      setOwner(user);
    } catch (error) {
      console.log("Gagal ambil data owner");
    }
  };

  const loadWarung = async () => {
    try {
      const res = await axiosInstance.get("/owner/warung");
      const warung = res.data;

      if (warung && warung.nama_warung) {
        setWarungExists(true);

        setNamaWarung(warung.nama_warung || "");
        setAlamatWarung(warung.alamat || "");

        setStokPertalite(
          warung.stok_pertalite ? String(warung.stok_pertalite) : ""
        );

        setStokPertamax(
          warung.stok_pertamax ? String(warung.stok_pertamax) : ""
        );

        setHargaPertalite(
          warung.harga_pertalite ? String(warung.harga_pertalite) : ""
        );

        setHargaPertamax(
          warung.harga_pertamax ? String(warung.harga_pertamax) : ""
        );

        setLatitude(warung.latitude || null);
        setLongitude(warung.longitude || null);
        setFoto(warung.foto || null);
      } else {
        setWarungExists(false);
      }
    } catch (error) {
      console.log("Warung belum ada");
      setWarungExists(false);
    }
  };

  const pilihFoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

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

  const simpanWarung = async () => {
    if (!namaWarung || !alamatWarung) {
      Alert.alert("Nama dan alamat wajib diisi");
      return;
    }

    if (!hargaPertalite || !hargaPertamax) {
      Alert.alert("Harga bensin harus diisi");
      return;
    }

    const formData = new FormData();

    formData.append("nama_warung", namaWarung);
    formData.append("alamat", alamatWarung);

    formData.append("stok_pertalite", stokPertalite);
    formData.append("stok_pertamax", stokPertamax);

    formData.append("harga_pertalite", hargaPertalite);
    formData.append("harga_pertamax", hargaPertamax);

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

      loadWarung();
    } catch (error) {
      console.log(error.response?.data);
      Alert.alert("Gagal menyimpan");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  const tambahPertalite = () => {
    setStokPertalite(String(parseInt(stokPertalite || "0") + 1));
  };

  const kurangPertalite = () => {
    if (parseInt(stokPertalite || "0") > 0) {
      setStokPertalite(String(parseInt(stokPertalite) - 1));
    }
  };

  const tambahPertamax = () => {
    setStokPertamax(String(parseInt(stokPertamax || "0") + 1));
  };

  const kurangPertamax = () => {
    if (parseInt(stokPertamax || "0") > 0) {
      setStokPertamax(String(parseInt(stokPertamax) - 1));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Owner</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
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

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Warung</Text>

          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text>Foto belum ada</Text>
            </View>
          )}

          <TouchableOpacity style={styles.button} onPress={pilihFoto}>
            <Text style={styles.buttonText}>Pilih Foto</Text>
          </TouchableOpacity>

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

          <Text style={styles.label}>Lokasi Warung</Text>

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

          <Text style={styles.label}>Stok Pertalite</Text>

          <View style={styles.stokRow}>
            <Text style={styles.stokText}>{stokPertalite || 0} Liter</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.stokButton}
                onPress={tambahPertalite}
              >
                <Text style={styles.stokButtonText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stokButton}
                onPress={kurangPertalite}
              >
                <Text style={styles.stokButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Harga Pertalite / Liter</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={hargaPertalite}
            onChangeText={setHargaPertalite}
          />

          <Text style={styles.label}>Stok Pertamax</Text>

          <View style={styles.stokRow}>
            <Text style={styles.stokText}>{stokPertamax || 0} Liter</Text>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.stokButton}
                onPress={tambahPertamax}
              >
                <Text style={styles.stokButtonText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.stokButton}
                onPress={kurangPertamax}
              >
                <Text style={styles.stokButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.label}>Harga Pertamax / Liter</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={hargaPertamax}
            onChangeText={setHargaPertamax}
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

      <OwnerBottomNav navigation={navigation} active="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: { fontSize: 18, fontWeight: "bold" },

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

  label: {
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },

  value: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
  },

  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },

  imagePlaceholder: {
    height: 200,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#9B59B6",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },

  locationButton: {
    backgroundColor: "#3498DB",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  saveButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
  },

  logoutButton: {
    backgroundColor: "#E74C3C",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: { color: "#fff", fontWeight: "bold" },

  smallText: {
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
    color: "#555",
  },

  stokRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8F9F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  stokText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonGroup: {
    flexDirection: "row",
  },

  stokButton: {
    backgroundColor: "#3498DB",
    width: 35,
    height: 35,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  stokButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});