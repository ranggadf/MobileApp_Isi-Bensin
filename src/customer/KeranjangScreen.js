import React, { useEffect, useState } from "react";

// komponen UI React Native
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

// safe area (biar tidak ketutup notch)
import { SafeAreaView } from "react-native-safe-area-context";

// icon dari Expo
import { Ionicons } from "@expo/vector-icons";

// GPS library
import * as Location from "expo-location";

// context cart global (sinkron backend & UI)
import { useCart } from "../component/CartContext";

// navigation antar screen
import { useNavigation } from "@react-navigation/native";

// API axios instance (terhubung ke Laravel backend)
import api from "../api/AxiosInstance";

// bottom navigation
import CustomerBottomNav from "../component/CustomerBottomNav";

export default function KeranjangScreen() {

  // =========================
  // 🔹 STATE MANAGEMENT
  // =========================
  const [cart, setCart] = useState([]); // data item keranjang
  const [selectedItems, setSelectedItems] = useState([]); // item yang dipilih
  const [userLocation, setUserLocation] = useState(null); // lokasi user GPS
  const [distance, setDistance] = useState(0); // jarak ke warung

  const navigation = useNavigation();

  // ambil fungsi reload cart dari context global
  const { loadCart: loadCartGlobal } = useCart();


  // =========================
  // 🔥 LOAD DATA SAAT HALAMAN DIBUKA
  // =========================
  useEffect(() => {
    loadCart(); // ambil data cart dari backend
    getUserLocation(); // ambil lokasi user
  }, []);


  // reset pilihan kalau cart berubah
  useEffect(() => {
    setSelectedItems([]);
    setDistance(0);
  }, [cart]);


  // =========================
  // 🔥 HITUNG JARAK OTOMATIS
  // =========================
  useEffect(() => {

    // jika ada item dipilih + lokasi tersedia
    if (selectedItems.length > 0 && userLocation && cart.length > 0) {

      // ambil item pertama yang dipilih
      const item = cart[selectedItems[0]];

      // ambil koordinat warung
      const lat2 = parseFloat(item.warung?.latitude);
      const lon2 = parseFloat(item.warung?.longitude);

      if (!lat2 || !lon2) return;

      // hitung jarak user → warung
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        lat2,
        lon2
      );

      setDistance(dist);
    }
  }, [selectedItems, userLocation]);


  // =========================
  // 🔹 AMBIL DATA CART DARI BACKEND
  // =========================
  const loadCart = async () => {
    try {
      const response = await api.get("/cart");

      // ambil item dari response Laravel
      const items = response.data.items || [];

      setCart(items);

      // sync ke context global
      loadCartGlobal();

    } catch (error) {
      console.log(error);
    }
  };


  // =========================
  // 🔥 AMBIL LOKASI USER (GPS)
  // =========================
  const getUserLocation = async () => {
    try {

      // minta izin GPS
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Izin lokasi ditolak");
        return;
      }

      // ambil posisi user
      let location = await Location.getCurrentPositionAsync({});

      setUserLocation(location.coords);

    } catch (error) {
      console.log(error);
    }
  };


  // =========================
  // 🔥 RUMUS HAVERSINE (HITUNG JARAK)
  // =========================
  const calculateDistance = (lat1, lon1, lat2, lon2) => {

    const R = 6371; // radius bumi (km)

    const dLat = (lat2 - lat1) * (Math.PI / 180); // ubah derajat ke radian
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // hasil jarak (km)
  };


  // =========================
  // 🔥 PILIH ITEM KERANJANG
  // =========================
  const toggleSelect = (index) => {

    // jika sudah dipilih → unselect
    if (selectedItems.includes(index)) {
      setSelectedItems([]);
      setDistance(0);
    } else {
      // pilih 1 item saja
      setSelectedItems([index]);
    }
  };


  // =========================
  // 🔥 HITUNG TOTAL HARGA
  // =========================
  const getSelectedTotal = () => {
    return selectedItems.reduce((total, index) => {
      const item = cart[index];
      if (!item) return total;

      return total + item.qty * item.harga;
    }, 0);
  };


  // ongkir berdasarkan jarak
  const getOngkir = () => Math.ceil(distance) * 1000;

  // total akhir
  const getGrandTotal = () => getSelectedTotal() + getOngkir();


  // =========================
  // 🔥 HAPUS ITEM
  // =========================
  const handleDelete = async (id) => {
    Alert.alert("Hapus", "Yakin ingin menghapus item ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          await api.delete(`/cart/${id}`);

          // hapus dari state lokal
          setCart((prev) => prev.filter((item) => item.id !== id));

          loadCartGlobal();
          setSelectedItems([]);
        },
      },
    ]);
  };


  // =========================
  // 🔥 VALIDASI CHECKOUT
  // =========================
  const canCheckout =
    selectedItems.length > 0 && userLocation && distance > 0;


  // =========================
  // 🔥 KONFIRMASI CHECKOUT
  // =========================
  const handleCheckout = async () => {
    if (!canCheckout) return;

    Alert.alert("Konfirmasi", "Lanjut checkout?", [
      { text: "Batal" },
      { text: "Ya", onPress: () => processCheckout() },
    ]);
  };


  // =========================
  // 🔥 PROSES CHECKOUT KE BACKEND
  // =========================
  const processCheckout = async () => {
    try {

      const selectedData = selectedItems.map((i) => cart[i]);

      // kirim order ke Laravel
      await api.post("/orders", {
        total_harga: getGrandTotal(),
        ongkir: getOngkir(),
        jarak: distance,
        warung_id: selectedData[0].warung_id,
        lat: userLocation.latitude,
        lng: userLocation.longitude,

        // kirim item yang dibeli
        items: selectedData.map((item) => ({
          jenis_bbm: item.jenis_bbm,
          qty: item.qty,
          harga: item.harga,
        })),
      });

      // kosongkan cart setelah checkout
      await api.delete("/cart-clear");

      setCart([]);
      loadCartGlobal();
      setSelectedItems([]);

      Alert.alert("Sukses", "Pesanan berhasil dibuat!");
      navigation.navigate("PesananScreen");

    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Checkout gagal");
    }
  };

  // ================== RENDER ITEM ==================
  const renderItem = ({ item, index }) => {
    const isSelected = selectedItems.includes(index);

    return (
      <View style={styles.card}>
        <TouchableOpacity onPress={() => toggleSelect(index)}>
          <Ionicons
            name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            size={26}
            color={isSelected ? "#16a34a" : "#64748b"}
          />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.nama}>{item.warung?.nama_warung}</Text>
          <Text style={styles.detail}>
            {item.jenis_bbm} - {item.qty} L
          </Text>
          <Text style={styles.harga}>
            Rp {(item.qty * item.harga).toLocaleString("id-ID")}
          </Text>
        </View>

        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  // ================== UI ==================
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Keranjang</Text>

        {cart.length === 0 ? (
          <Text style={styles.empty}>Keranjang masih kosong</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 180 }}
          />
        )}

        {/* ================= FOOTER ================= */}
        <View style={styles.footer}>
          {selectedItems.length === 0 ? (
            <Text style={styles.emptyFooter}>
              Pilih item untuk melihat total
            </Text>
          ) : (
            <>
              {selectedItems.map((index) => {
                const item = cart[index];
                if (!item) return null;

                return (
                  <Text key={index} style={styles.detailText}>
                    {item.qty}L {item.jenis_bbm} = Rp{" "}
                    {(item.qty * item.harga).toLocaleString("id-ID")}
                  </Text>
                );
              })}

              <Text style={styles.ongkir}>
                Jarak: {distance > 0 ? distance.toFixed(2) : "-"} km
              </Text>

              <Text style={styles.ongkir}>
                Ongkir: Rp {getOngkir().toLocaleString("id-ID")}
              </Text>

              <Text style={styles.totalText}>
                Total: Rp {getGrandTotal().toLocaleString("id-ID")}
              </Text>

              <Text style={styles.metode}>Metode Pembayaran: COD</Text>

              {canCheckout ? (
                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={handleCheckout}
                >
                  <Text style={styles.checkoutText}>Checkout</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.checkoutDisabled}>
                  <Text style={styles.checkoutDisabledText}>
                    Pilih item & tunggu lokasi/jarak
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

// ================== STYLES ==================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F1F5F9" },
  title: { fontSize: 22, fontWeight: "bold", margin: 16 },

  empty: { textAlign: "center", marginTop: 50, color: "#64748b" },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  nama: { fontWeight: "bold", fontSize: 16 },
  detail: { color: "#475569", marginTop: 4 },
  harga: { marginTop: 6, fontWeight: "600", color: "#16a34a" },

  footer: {
    position: "absolute",
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
  },

  emptyFooter: {
    textAlign: "center",
    color: "#64748b",
  },

  detailText: { fontSize: 14, color: "#334155" },
  ongkir: { marginTop: 6, color: "#475569" },
  totalText: { fontSize: 18, fontWeight: "bold", marginTop: 6 },

  metode: { marginTop: 6, color: "#475569" },

  checkoutBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  checkoutText: { color: "#fff", fontWeight: "bold" },

  checkoutDisabled: {
    backgroundColor: "#cbd5e1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  checkoutDisabledText: {
    color: "#475569",
    fontWeight: "600",
    fontSize: 13,
  },
});