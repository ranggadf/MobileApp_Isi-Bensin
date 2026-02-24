import React from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function PesananScreen() {
  const navigation = useNavigation();

  // STATIC DATA
  const orders = [
    {
      id: 1,
      status: "Menunggu Konfirmasi",
      items: [
        {
          id: 11,
          nama: "Classic Chair",
          price: 153000,
          qty: 2,
          image: "https://i.ibb.co/4mLdrJ8/chair.jpg",
        },
      ],
      total: 306000,
    },
    {
      id: 2,
      status: "Dikemas",
      items: [
        {
          id: 22,
          nama: "Minimalis Lamp",
          price: 94000,
          qty: 1,
          image: "https://i.ibb.co/s6Cp3p3/lamp.jpg",
        },
      ],
      total: 94000,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Pesanan Saya</Text>
      </View>

      {/* LIST PESANAN */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View key={order.id} style={styles.card}>
            
            <View style={styles.row}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <Text style={[styles.status, 
                order.status === "Dikemas" && { color: "#00C853" },
              ]}>
                {order.status}
              </Text>
            </View>

            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.nama}</Text>
                  <Text style={styles.price}>
                    {item.qty}x Rp {item.price.toLocaleString("id-ID")}
                  </Text>
                </View>
              </View>
            ))}

            <Text style={styles.total}>
              Total: Rp {order.total.toLocaleString("id-ID")}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("DashboardCustomer")}>
          <Ionicons name="home-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("KeranjangScreen")}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PesananScreen")}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("RiwayatScreen")}>
          <Ionicons name="time-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1520",
    paddingHorizontal: 15,
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#2A2F3A",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    color: "#fff",
    fontWeight: "600",
  },
  status: {
    color: "#FF9800",
    fontWeight: "700",
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
    color: "#fff",
    fontWeight: "600",
  },
  price: {
    color: "#ddd",
  },
  total: {
    marginTop: 6,
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  bottomNav: {
    height: 72,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1B202B",
    borderTopWidth: 1,
    borderTopColor: "#2A2F3A",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
