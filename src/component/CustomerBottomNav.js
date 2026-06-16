import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";

// 🔥 IMPORT CONTEXT
import { useCart } from "../component/CartContext";

export default function CustomerBottomNav() {
  const navigation = useNavigation();

  const route = useRoute();

  const insets = useSafeAreaInsets();

  // 🔥 AMBIL DATA CART GLOBAL
  const { cartCount } = useCart();

  const NavItem = ({
    icon,
    label,
    screen,
  }) => {
    const isActive =
      route.name === screen;

    return (
      <TouchableOpacity
        style={styles.navItem}
        onPress={() =>
          navigation.navigate(screen)
        }
      >
        {/* 🔥 WRAP ICON */}
        <View
          style={styles.iconWrapper}
        >
          <Ionicons
            name={icon}
            size={24}
            color={
              isActive
                ? "#2563EB"
                : "#94A3B8"
            }
          />

          {/* 🔥 BADGE ANGKA */}
          {screen ===
            "KeranjangScreen" &&
            cartCount > 0 && (
              <View
                style={styles.badge}
              >
                <Text
                  style={
                    styles.badgeText
                  }
                >
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </Text>
              </View>
            )}
        </View>

        <Text
          style={
            isActive
              ? styles.activeNav
              : styles.navText
          }
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.bottomNav,
        {
          paddingBottom:
            insets.bottom > 0
              ? insets.bottom
              : 15,
        },
      ]}
    >
      <NavItem
        icon="home-outline"
        label="Beranda"
        screen="DashboardCustomer"
      />

      <NavItem
        icon="cart-outline"
        label="Keranjang"
        screen="KeranjangScreen"
      />

      <NavItem
        icon="chatbubble-outline"
        label="Pesanan"
        screen="PesananScreen"
      />

      <NavItem
        icon="time-outline"
        label="Riwayat"
        screen="RiwayatScreen"
      />

      <NavItem
        icon="person-outline"
        label="Profile"
        screen="ProfileScreen"
      />
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
    backgroundColor: "#FFFFFF",
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },

  navItem: {
    alignItems: "center",
  },

  iconWrapper: {
    position: "relative",
  },

  navText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },

  activeNav: {
    fontSize: 12,
    color: "#2563EB",
    fontWeight: "bold",
    marginTop: 2,
  },

  // 🔥 BADGE
  badge: {
    position: "absolute",
    top: -8,
    right: -12,

    minWidth: 18,
    height: 18,

    borderRadius: 9,

    backgroundColor: "#EF4444",

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 4,
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});