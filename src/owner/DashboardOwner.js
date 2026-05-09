import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

import OwnerBottomNav from "../component/OwnerBottomNav";
import axiosInstance from "../api/AxiosInstance";

const { width } = Dimensions.get("window");

export default function DashboardOwner({ navigation }) {
  const insets = useSafeAreaInsets();

  const [warung, setWarung] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
const [totalPesanan, setTotalPesanan] = useState(0);

  const isFetching = useRef(false);

  // ================= WARUNG =================
  const loadWarung = async () => {
    try {
      const res = await axiosInstance.get("/owner/warung");
      setWarung(res.data);
    } catch (error) {
      console.log("Gagal mengambil data warung");
    }
  };

  // ================= ORDERS (FIX FINAL + ANTI 429) =================
  const loadOrders = async () => {
    if (isFetching.current) return;

    isFetching.current = true;

    try {
      const res = await axiosInstance.get("/owner/orders");

      const data = Array.isArray(res.data) ? res.data : [];

      // 🔥 normalize status + filter pending
      const pendingOrders = data.filter(
        (item) => item.status?.toLowerCase() === "pending"
      );

      setOrders(pendingOrders);
    } catch (error) {
      console.log("Gagal mengambil data orders", error.message);
    } finally {
      isFetching.current = false;
    }
  };

  // ================= PENDAPATAN =================
const loadPendapatan = async () => {
  try {
    const res = await axiosInstance.get("/owner/pendapatan");

    setTotalPendapatan(res.data.total_pendapatan || 0);
    setTotalPesanan(res.data.total_pesanan || 0);

  } catch (error) {
    console.log("Gagal mengambil pendapatan");
  }
};

  // ================= FOCUS =================
 useFocusEffect(
  useCallback(() => {
    loadWarung();
    loadOrders();
    loadPendapatan();
  }, [])
);

  // ================= POLLING AMAN =================
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders();
    }, 8000); // 🔥 aman dari 429

    return () => clearInterval(interval);
  }, []);

  // ================= IMAGE =================
  const imageUrl = warung?.foto
    ? `http://192.168.1.8:8000/storage/${warung.foto}`
    : null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Beranda</Text>

        {/* NOTIF ICON */}
        <TouchableOpacity
          style={styles.notifIcon}
          onPress={() => setShowNotif(!showNotif)}
        >
          <Ionicons name="notifications-outline" size={26} color="#000" />

          {/* 🔴 BADGE */}
          {orders.length > 0 && <View style={styles.badge} />}
        </TouchableOpacity>
      </View>

      {/* NOTIF POPUP */}
      {showNotif && (
        <View style={styles.notifBox}>
          {orders.length === 0 ? (
            <Text style={styles.notifText}>Belum ada pesanan</Text>
          ) : (
            orders.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.notifItem}
                onPress={() => {
                  setShowNotif(false);
                  navigation.navigate("PesananOwner");
                }}
              >
              

                <Text style={styles.notifDesc}>
                   Pesanan baru masuk! Segera proses 🚀
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
      >
        {!warung ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Anda belum membuat warung
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("ProfileOwner")}
            >
              <Text style={styles.createButtonText}>
                Buat Warung Sekarang
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.warungContainer}>
              <Image
                source={
                  imageUrl
                    ? { uri: imageUrl }
                    : require("../../assets/profile.jpeg")
                }
                style={styles.warungImage}
              />

              <Text style={styles.namaWarung}>
                {warung?.nama_warung}
              </Text>

              <TouchableOpacity
                style={styles.kelolaButton}
                onPress={() => navigation.navigate("ProfileOwner")}
              >
                <Text style={styles.kelolaText}>Kelola Warung</Text>
              </TouchableOpacity>
            </View>

            {/* ================= STATISTIK ================= */}
<View style={styles.statistikContainer}>

  {/* TOTAL PENDAPATAN */}
  <View style={styles.statCard}>
    <Ionicons
      name="wallet-outline"
      size={28}
      color="#2ECC71"
    />

    <Text style={styles.statLabel}>
      Total Pendapatan
    </Text>

    <Text style={styles.statValue}>
      Rp {Number(totalPendapatan).toLocaleString("id-ID")}
    </Text>
  </View>

  {/* TOTAL PESANAN */}
  <View style={styles.statCard}>
    <Ionicons
      name="receipt-outline"
      size={28}
      color="#2E86DE"
    />

    <Text style={styles.statLabel}>
      Pesanan Selesai
    </Text>

    <Text style={styles.statValue}>
      {totalPesanan}
    </Text>
  </View>

</View>

            <View style={styles.stokContainer}>
              <Text style={styles.stokTitle}>Stok & Harga BBM</Text>

              <View style={styles.stokItem}>
                <View>
                  <Text style={styles.stokLabel}>Pertalite</Text>
                  <Text style={styles.hargaText}>
                    Rp {warung?.harga_pertalite} / L
                  </Text>
                </View>
                <Text style={styles.stokValue}>
                  {warung?.stok_pertalite} L
                </Text>
              </View>

              <View style={styles.stokItem}>
                <View>
                  <Text style={styles.stokLabel}>Pertamax</Text>
                  <Text style={styles.hargaText}>
                    Rp {warung?.harga_pertamax} / L
                  </Text>
                </View>
                <Text style={styles.stokValue}>
                  {warung?.stok_pertamax} L
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* 🔥 FIX PENTING: kirim orderCount ke bottom nav */}
      <OwnerBottomNav
        navigation={navigation}
        active="Dashboard"
        orderCount={orders.length}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  header: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: "bold",
  },

  notifIcon: {
    position: "absolute",
    right: 20,
  },

  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "red",
  },

  notifBox: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },

  notifItem: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 8,
  },

  notifTitle: {
    fontWeight: "bold",
  },

  notifDesc: {
    fontSize: 13,
    color: "#666",
  },

  notifText: {
    textAlign: "center",
    color: "#666",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  warungContainer: {
    alignItems: "center",
  },

  warungImage: {
    width: "100%",
    height: width * 0.45,
    borderRadius: 12,
  },

  namaWarung: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginTop: 12,
  },

  kelolaButton: {
    marginTop: 12,
    backgroundColor: "#2E86DE",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  kelolaText: {
    color: "#fff",
    fontWeight: "bold",
  },

  stokContainer: {
    marginTop: 30,
  },

  stokTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    marginBottom: 15,
  },

  stokItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  stokLabel: {
    fontSize: width * 0.04,
    fontWeight: "bold",
  },

  stokValue: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#2E86DE",
  },

  hargaText: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
  },

  emptyContainer: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    marginBottom: 15,
  },

  createButton: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  statistikContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 25,
},

statCard: {
  width: "48%",
  backgroundColor: "#fff",
  borderRadius: 14,
  padding: 18,
  elevation: 3,
},

statLabel: {
  marginTop: 10,
  color: "#666",
  fontSize: 13,
},

statValue: {
  marginTop: 8,
  fontSize: 18,
  fontWeight: "bold",
  color: "#1e293b",
},
});