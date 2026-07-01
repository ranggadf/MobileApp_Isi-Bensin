import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import { useCart } from "../component/CartContext";

import CustomerBottomNav from "../component/CustomerBottomNav";

export default function DetailWarungScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { warung } = route.params;

  const [pertalite, setPertalite] = useState(1);
  const [pertamax, setPertamax] = useState(1);

  const { addToCart } = useCart();

  const MAX_LITER = 4; // 🔥 TAMBAHAN

  const handleAddToCart = (jenis, qty) => {
    // 🔥 VALIDASI MAX 4 LITER
    if (qty > MAX_LITER) {
      Alert.alert("Batas Maksimal", "Maksimal pembelian 4 liter");
      return;
    }

    if (jenis === "Pertalite" && qty > warung.stok_pertalite) {
      Alert.alert("Stok Habis", "Stok Pertalite tidak mencukupi");
      return;
    }

    if (jenis === "Pertamax" && qty > warung.stok_pertamax) {
      Alert.alert("Stok Habis", "Stok Pertamax tidak mencukupi");
      return;
    }

    Alert.alert(
      "Konfirmasi",
      `Yakin mau menambahkan ${jenis} ${qty} liter ke keranjang?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Ya",
          onPress: async () => {
            try {
              await addToCart({
                warung_id: warung.id,
                jenis_bbm: jenis,
                qty: qty,
                harga: jenis === "Pertalite" ? 10000 : 14000,
              });

              Alert.alert("Berhasil", "Item masuk ke keranjang");
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Gagal tambah ke keranjang");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Image
          source={{
            uri: `http://192.168.1.6:8000/storage/${warung.foto}`,
          }}
          style={styles.image}
        />

        <View style={styles.container}>
          <Text style={styles.nama}>{warung.nama_warung}</Text>
          <Text style={styles.alamat}>{warung.alamat}</Text>

          <Text style={styles.deskripsi}>
            Warung disini menyediakan pemesanan dan pengantaran bahan bakar
            bensin. Silahkan pesan bensin dan lanjutkan perjalanan anda
          </Text>

         <TouchableOpacity
  style={styles.routeButton}
  onPress={() => {
    const lat = warung.latitude;
    const lng = warung.longitude;

    if (!lat || !lng) {
      Alert.alert("Error", "Lokasi warung tidak tersedia");
      return;
    }

    navigation.navigate("RouteMapsScreen", {
      warung: {
        latitude: lat,
        longitude: lng,
        nama_warung: warung.nama_warung,
      },
    });
  }}
>
  <Ionicons name="navigate-outline" size={20} color="#fff" />
  <Text style={styles.routeText}>Lihat Rute</Text>
</TouchableOpacity>

          <Text style={styles.sectionTitle}>Pesan BBM</Text>

          {/* PERTALITE */}
          <View style={styles.bbmRow}>
            <View>
              <Text style={styles.bbmName}>Pertalite</Text>
              <Text style={styles.stokText}>
                Stok: {warung.stok_pertalite} L
              </Text>
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() => setPertalite(Math.max(1, pertalite - 1))}
              >
                <Ionicons name="remove-circle-outline" size={26} color="#2563EB" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{pertalite} L</Text>

              <TouchableOpacity
                onPress={() => {
                  if (pertalite >= MAX_LITER) {
                    Alert.alert("Batas Maksimal", "Maksimal 4 liter");
                    return;
                  }

                  if (pertalite < warung.stok_pertalite) {
                    setPertalite(pertalite + 1);
                  } else {
                    Alert.alert("Maksimal", "Sudah mencapai batas stok");
                  }
                }}
              >
                <Ionicons name="add-circle-outline" size={26} color="#2563EB" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => handleAddToCart("Pertalite", pertalite)}
            >
              <Ionicons name="cart-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* PERTAMAX */}
          <View style={styles.bbmRow}>
            <View>
              <Text style={styles.bbmName}>Pertamax</Text>
              <Text style={styles.stokText}>
                Stok: {warung.stok_pertamax} L
              </Text>
            </View>

            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() => setPertamax(Math.max(1, pertamax - 1))}
              >
                <Ionicons name="remove-circle-outline" size={26} color="#2563EB" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{pertamax} L</Text>

              <TouchableOpacity
                onPress={() => {
                  if (pertamax >= MAX_LITER) {
                    Alert.alert("Batas Maksimal", "Maksimal 4 liter");
                    return;
                  }

                  if (pertamax < warung.stok_pertamax) {
                    setPertamax(pertamax + 1);
                  } else {
                    Alert.alert("Maksimal", "Sudah mencapai batas stok");
                  }
                }}
              >
                <Ionicons name="add-circle-outline" size={26} color="#2563EB" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => handleAddToCart("Pertamax", pertamax)}
            >
              <Ionicons name="cart-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  image: {
    width: "100%",
    height: 220,
    resizeMode: "cover",
  },

  container: {
    padding: 16,
  },

  nama: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },

  alamat: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
  },

  deskripsi: {
    marginTop: 8,
    color: "#475569",
    lineHeight: 20,
    fontSize: 13,
  },

  routeButton: {
    marginTop: 12,
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  routeText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },

  sectionTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },

  bbmRow: {
    marginTop: 14,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    // shadow android
    elevation: 3,

    // shadow ios
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  bbmName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
  },

  stokText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },

  cartButton: {
    backgroundColor: "#16a34a",
    padding: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
});