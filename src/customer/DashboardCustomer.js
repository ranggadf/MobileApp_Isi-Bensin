import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

export default function DashboardCustomer() {
  const navigation = useNavigation();

  const dataWarung = [
    { id: 1, nama: "Warung A", alamat: "Jl. MT Haryono" },
    { id: 2, nama: "Warung B", alamat: "Jl. Soekarno Hatta" },
    { id: 3, nama: "Warung C", alamat: "Jl. DI Panjaitan" },
    { id: 4, nama: "Warung D", alamat: "Jl. Urip Sumoharjo" },
  ];

  return (
    <SafeAreaView style={styles.container}>

      {/* ===== HEADER ===== */}
     <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.navigate("ProfileScreen")}>
    <Ionicons name="person-circle-outline" size={50} color="#fff" />
  </TouchableOpacity>

  <View style={{ flex: 1 }} />

  <Ionicons
    name="location-outline"
    size={40}
    color="#fff"
    onPress={() => navigation.navigate("MapsScreen")}
  />
</View>

      {/* ===== INFO TEXT ===== */}
      <View style={styles.info}>
        <Text style={styles.infoTitle}>
          Cari Warung bensin 24 jam terdekat di sekitar!
        </Text>
        <Text style={styles.infoSub}>
          Warung bensin 24 jam terdekat
        </Text>
      </View>

      {/* ===== CONTENT ===== */}
      <View style={styles.content}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
        >
          {dataWarung.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate("DetailWarung", { data: item })}
            >
              <View style={styles.cardImage} />
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.nama}</Text>
                <Text
                  style={styles.cardLihat}
                  onPress={() => navigation.navigate("DetailWarung", { data: item })}
                >
                  Lihat
                </Text>
                <Text style={styles.cardJarak}>1km dari sini</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ===== BOTTOM NAV ===== */}
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
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  info: {
    paddingHorizontal: 15,
    marginBottom: 10,
    marginTop: 30,
  },

  infoTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },

  infoSub: {
    fontSize: 18,
    fontWeight: "400",
    color: "#D0D0D0",
  },

  content: {
    flex: 1,
  },

  grid: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#2A2F3A",
    borderRadius: 12,
    marginBottom: 30,
    overflow: "hidden",
    marginTop: 30,
  },

  cardImage: {
    height: 110,
    backgroundColor: "#808080",
  },

  cardInfo: {
    padding: 8,
    alignItems: "center",
  },

  cardName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },

  cardLihat: {
    fontSize: 12,
    color: "#bfbfbf",
    marginBottom: 2,
  },

  cardJarak: {
    fontSize: 12,
    color: "#4DA3FF",
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
