import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CustomerBottomNav from "../component/CustomerBottomNav";
import api from "../api/AxiosInstance";

export default function RiwayatScreen() {
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiwayat();

    const interval = setInterval(fetchRiwayat, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchRiwayat = async () => {
    try {
      const response = await api.get("/my-orders");

      const data = Array.isArray(response.data) ? response.data : [];

      // filter hanya selesai & ditolak
      const filtered = data.filter((order) => {
        const status = order.status?.toLowerCase();
        return status === "selesai" || status === "ditolak";
      });

      setRiwayatData(filtered);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#2563EB" />;
    }

    if (riwayatData.length === 0) {
      return <Text style={styles.empty}>Belum ada riwayat</Text>;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {riwayatData.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* HEADER */}
            <View style={styles.row}>
              <Text style={styles.orderId}>ORD-{item.id}</Text>
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      item.status?.toLowerCase() === "ditolak"
                        ? "#EF4444"
                        : "#16A34A",
                  },
                ]}
              >
                {item.status}
              </Text>
            </View>

            {/* ITEM */}
            <View style={styles.itemRow}>
              <Image
                source={{ uri: "https://via.placeholder.com/70" }}
                style={styles.image}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  {item?.warung?.nama_warung || "Warung"}
                </Text>

                {Array.isArray(item.items) &&
                  item.items.map((itm, index) => (
                    <Text key={`${item.id}-${index}`} style={styles.price}>
                      {itm.jenis_bbm} • {itm.qty}L
                    </Text>
                  ))}
              </View>
            </View>

            {/* TOTAL */}
            <Text style={styles.total}>
              Total: Rp {item.total_harga}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Riwayat Pesanan</Text>
      </View>

      {/* CONTENT */}
      {renderContent()}

      {/* BOTTOM NAV */}
      <CustomerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  header: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 22,
    color: "#1e293b",
    fontWeight: "bold",
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
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  orderId: {
    color: "#1e293b",
    fontWeight: "600",
  },

  status: {
    fontWeight: "600",
  },

  itemRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },

  name: {
    color: "#1e293b",
    fontWeight: "bold",
  },

  price: {
    color: "#475569",
  },

  total: {
    marginTop: 6,
    color: "#16a34a",
    fontSize: 15,
    fontWeight: "bold",
  },
});