import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function OwnerBottomNav() {
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
          color={isActive ? "#2E86DE" : "#555"}
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
      <NavItem icon="home-outline" label="Home" screen="DashboardOwner" />
      <NavItem icon="cart-outline" label="Pesanan" screen="PesananOwner" />
      <NavItem icon="time-outline" label="Riwayat" screen="RiwayatOwner" />
      <NavItem icon="person-outline" label="ProfileOwner" screen="ProfileOwner" />
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
    backgroundColor: "#fff",
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },

  navItem: {
    alignItems: "center",
  },

  navText: {
    fontSize: 12,
    color: "#555",
  },

  activeNav: {
    fontSize: 12,
    color: "#2E86DE",
    fontWeight: "bold",
  },
});