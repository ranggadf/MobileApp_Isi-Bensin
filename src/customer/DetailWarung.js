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

import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomerBottomNav from "../component/CustomerBottomNav";

export default function DetailWarungScreen() {
  const route = useRoute();
  const navigation = useNavigation();

  const { warung } = route.params;

  const [pertalite, setPertalite] = useState(1);
  const [pertamax, setPertamax] = useState(1);

  // 🔥 FUNCTION TAMBAH KE KERANJANG (SUDAH ADA VALIDASI STOK)
  const handleAddToCart = (jenis, qty) => {

    // 🔥 VALIDASI STOK
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
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: async () => {
            const item = {
              warung_id: warung.id,
              nama_warung: warung.nama_warung,
              jenis_bbm: jenis,
              qty: qty,
              harga: jenis === "Pertalite" ? 10000 : 14000,

              latitude: parseFloat(warung.latitude),
              longitude: parseFloat(warung.longitude),
            };

            try {
              const existing = await AsyncStorage.getItem("cart");
              let cart = existing ? JSON.parse(existing) : [];

              cart.push(item);

              await AsyncStorage.setItem("cart", JSON.stringify(cart));

              Alert.alert("Berhasil", "Item masuk ke keranjang");
            } catch (error) {
              console.log("Error simpan cart:", error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* FOTO WARUNG */}
        <Image
          source={{
            uri: `http://10.10.11.98:8000/storage/${warung.foto}`,
          }}
          style={styles.image}
        />

        <View style={styles.container}>
          
          {/* NAMA WARUNG */}
          <Text style={styles.nama}>{warung.nama_warung}</Text>

          {/* ALAMAT */}
          <Text style={styles.alamat}>{warung.alamat}</Text>

          {/* DESKRIPSI */}
          <Text style={styles.deskripsi}>
            Warung disini menyediakan pemesanan dan pengantaran bahan bakar
            bensin. Silahkan pesan bensin dan lanjutkan perjalanan anda
          </Text>

          {/* BUTTON LIHAT RUTE */}
          <TouchableOpacity
            style={styles.routeButton}
            onPress={() =>
              navigation.navigate("RouteMapsScreen", { warung })
            }
          >
            <Ionicons name="navigate-outline" size={20} color="#fff" />
            <Text style={styles.routeText}>Lihat Rute</Text>
          </TouchableOpacity>

          {/* PESAN BBM */}
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

      {/* BOTTOM NAV */}
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
  },

  deskripsi: {
    marginTop: 8,
    color: "#475569",
    lineHeight: 20,
  },

  routeButton: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  routeText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
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
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bbmName: {
    fontSize: 16,
    fontWeight: "600",
  },

  stokText: {
    fontSize: 12,
    color: "#64748b",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "600",
  },

  cartButton: {
    backgroundColor: "#16a34a",
    padding: 8,
    borderRadius: 8,
  },
});