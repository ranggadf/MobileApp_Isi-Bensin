import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";

import { useNavigation } from "@react-navigation/native";
import api from "../api/AxiosInstance";

import CustomerBottomNav from "../component/CustomerBottomNav";

export default function KeranjangScreen() {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    loadCart();
    getUserLocation();
  }, []);

  // reset pilihan kalau cart berubah
  useEffect(() => {
    setSelectedItems([]);
  }, [cart]);

  const loadCart = async () => {
    try {
      const data = await AsyncStorage.getItem("cart");
      if (data) {
        setCart(JSON.parse(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Izin lokasi ditolak");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    if (userLocation && selectedItems.length > 0) {
      const item = cart[selectedItems[0]];

      if (!item || !item.latitude || !item.longitude) return;

      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(item.latitude),
        parseFloat(item.longitude)
      );

      setDistance(dist);
    }
  }, [userLocation, selectedItems]);

  // 🔥 FIX: hanya bisa pilih 1 item
  const toggleSelect = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems([]);
    } else {
      setSelectedItems([index]);
    }
  };

  const getSelectedTotal = () => {
    return selectedItems.reduce((total, index) => {
      const item = cart[index];
      if (!item) return total;
      return total + item.qty * item.harga;
    }, 0);
  };

  const getOngkir = () => {
    return Math.ceil(distance) * 1000;
  };

  const getGrandTotal = () => {
    return getSelectedTotal() + getOngkir();
  };

  const handleDelete = (index) => {
    Alert.alert("Hapus", "Yakin ingin menghapus item ini?", [
      { text: "Batal" },
      {
        text: "Hapus",
        onPress: async () => {
          let newCart = [...cart];
          newCart.splice(index, 1);

          setCart(newCart);
          await AsyncStorage.setItem("cart", JSON.stringify(newCart));

          setSelectedItems([]); // biar aman
        },
      },
    ]);
  };

  // =========================
  // CHECKOUT
  // =========================

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Pilih item dulu");
      return;
    }

    Alert.alert(
      "Konfirmasi",
      `Total: Rp ${getGrandTotal()}\nYakin checkout pesanan ini?`,
      [
        { text: "Batal" },
        {
          text: "Ya",
          onPress: processCheckout,
        },
      ]
    );
  };

  const processCheckout = async () => {
    try {
      const selectedData = selectedItems
        .map((index) => cart[index])
        .filter((item) => item);

      if (!selectedData.length || !selectedData[0]?.warung_id) {
        Alert.alert("Error", "Warung tidak valid");
        return;
      }

      const payload = {
        total_harga: getGrandTotal(),
        ongkir: getOngkir(),
        jarak: distance,
        warung_id: selectedData[0].warung_id,
        items: selectedData.map((item) => ({
          jenis_bbm: item.jenis_bbm,
          qty: item.qty,
          harga: item.harga,
        })),
      };

      await api.post("/orders", payload);

      Alert.alert("Sukses", "Pesanan berhasil dibuat!");

      const newCart = cart.filter(
        (_, index) => !selectedItems.includes(index)
      );

      setCart(newCart);
      await AsyncStorage.setItem("cart", JSON.stringify(newCart));

      setSelectedItems([]);

      navigation.navigate("PesananScreen");
    } catch (error) {
      console.log(error.response?.data || error);
      Alert.alert("Error", "Checkout gagal");
    }
  };

  // =========================

  const renderItem = ({ item, index }) => {
    if (!item) return null;

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
          <Text style={styles.nama}>{item.nama_warung}</Text>
          <Text style={styles.detail}>
            {item.jenis_bbm} - {item.qty} L
          </Text>
          <Text style={styles.harga}>
            Rp {item.qty * item.harga}
          </Text>
        </View>

        <TouchableOpacity onPress={() => handleDelete(index)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Keranjang</Text>

        {cart.length === 0 ? (
          <Text style={styles.empty}>Keranjang masih kosong</Text>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 180 }}
          />
        )}

        <View style={styles.footer}>
          {selectedItems.map((index) => {
            const item = cart[index];
            if (!item) return null;

            return (
              <Text key={index} style={styles.detailText}>
                {item.nama_warung} - {item.qty}L {item.jenis_bbm} = Rp{" "}
                {item.qty * item.harga}
              </Text>
            );
          })}

          <Text style={styles.ongkir}>
            Ongkir (COD {distance.toFixed(2)} km): Rp {getOngkir()}
          </Text>

          <Text style={styles.totalText}>
            Total: Rp {getGrandTotal()}
          </Text>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

// styles tetap
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 16,
    color: "#1e293b",
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    color: "#64748b",
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  nama: {
    fontWeight: "bold",
    fontSize: 16,
  },
  detail: {
    color: "#475569",
    marginTop: 4,
  },
  harga: {
    marginTop: 6,
    fontWeight: "600",
    color: "#16a34a",
  },
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
  detailText: {
    fontSize: 14,
    color: "#334155",
  },
  ongkir: {
    marginTop: 8,
    color: "#475569",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  checkoutBtn: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  checkoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});