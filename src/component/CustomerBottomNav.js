import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function CustomerBottomNav() {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const NavItem = ({ icon, label, screen }) => {
    const isActive = route.name === screen;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate(screen)}
      >
        <Ionicons
          name={icon}
          size={24}
          color={isActive ? "#2563EB" : "#94A3B8"}
        />
        <Text style={isActive ? styles.activeNav : styles.navText}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.bottomNav,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 },
      ]}
    >
      <NavItem icon="home-outline" label="Home" screen="DashboardCustomer" />

      <NavItem icon="cart-outline" label="Keranjang" screen="KeranjangScreen" />

      <NavItem icon="chatbubble-outline" label="Pesanan" screen="PesananScreen" />

      <NavItem icon="time-outline" label="Riwayat" screen="RiwayatScreen" />

      <NavItem icon="person-outline" label="Profile" screen="ProfileScreen" />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF", // background putih
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 12,
    color: "#94A3B8", // abu saat tidak aktif
  },

  activeNav: {
    fontSize: 12,
    color: "#2563EB", // biru saat aktif
    fontWeight: "bold",
  },
});