import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function KeranjangScreen() {
  const navigation = useNavigation(); // ⬅ WAJIB ADA

  const cartData = [
    { id: 1, nama: "Bensin Pertalite", price: 153000, qty: 1, image: "https://i.ibb.co/4mLdrJ8/chair.jpg" },
    { id: 2, nama: "Bensin Pertamax", price: 153000, qty: 3, image: "https://i.ibb.co/4mLdrJ8/chair.jpg" },
    { id: 3, nama: "Bensin", price: 153000, qty: 1, image: "https://i.ibb.co/4mLdrJ8/chair.jpg" },
  ];

  const subtotal = cartData.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const delivery = 6000;
  const total = subtotal + delivery;

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Keranjang</Text>
        <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
      </View>

      {/* LIST ITEM */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {cartData.map((item) => (
          <View key={item.id} style={styles.card}>

            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.info}>
              <Text style={styles.name}>{item.nama}</Text>
              <Text style={styles.price}>Rp {item.price.toLocaleString("id-ID")}</Text>
            </View>

            <View style={styles.counter}>
              <TouchableOpacity style={styles.btnCounter}>
                <Text style={styles.btnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.qty}</Text>
              <TouchableOpacity style={styles.btnCounter}>
                <Text style={styles.btnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* PAYMENT DETAIL */}
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal</Text>
          <Text style={styles.value}>Rp {subtotal.toLocaleString("id-ID")}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery & Handling</Text>
          <Text style={styles.value}>Rp {delivery.toLocaleString("id-ID")}</Text>
        </View>

        <Text style={styles.paymentMethod}>Metode pembayaran : Bayar di Tempat</Text>

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>Rp {total.toLocaleString("id-ID")}</Text>
        </View>

        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Check Out</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM NAV */}
    {/* ===== BOTTOM NAV (SAMA DENGAN SCREEN LAIN) ===== */}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#2A2F3A",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#fff",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  image: {
    width: 65,
    height: 65,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#404654",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  btnCounter: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    marginTop: -2,
  },
  qty: {
    color: "#fff",
    fontSize: 15,
    marginHorizontal: 6,
    fontWeight: "700",
  },
  summary: {
    backgroundColor: "#1B202B",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    color: "#D0D0D0",
    fontSize: 14,
  },
  value: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  paymentMethod: {
    color: "#D0D0D0",
    fontSize: 13,
    marginVertical: 6,
  },
  totalLabel: {
    color: "#D0D0D0",
    fontSize: 15,
    fontWeight: "600",
  },
  totalValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  checkoutBtn: {
    marginTop: 15,
    backgroundColor: "#007BFF",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 10,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
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
