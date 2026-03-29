import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../api/AxiosInstance";
import CustomerBottomNav from "../component/CustomerBottomNav";

export default function PesananScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get("/my-orders");
      setOrders(response.data);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.nama}>
          {item?.warung?.nama_warung || "Nama warung tidak ada"}
        </Text>

        {item.items?.map((itm, index) => (
          <Text key={index} style={styles.detail}>
            {itm.qty}L {itm.jenis_bbm} = Rp {itm.qty * itm.harga}
          </Text>
        ))}

        <Text style={styles.ongkir}>
          Ongkir: Rp {item.ongkir}
        </Text>

        <Text style={styles.total}>
          Total: Rp {item.total_harga}
        </Text>

        <Text style={styles.status}>
          Status: {item.status}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>Pesanan Saya</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2563EB" />
        ) : orders.length === 0 ? (
          <Text style={styles.empty}>Belum ada pesanan</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

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
  },

  nama: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },

  detail: {
    color: "#475569",
  },

  ongkir: {
    marginTop: 6,
    color: "#475569",
  },

  total: {
    marginTop: 6,
    fontWeight: "bold",
    color: "#16a34a",
  },

  status: {
    marginTop: 6,
    fontWeight: "600",
    color: "#2563EB",
  },
});