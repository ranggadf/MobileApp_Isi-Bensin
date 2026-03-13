import React, { useEffect, useState } from "react";
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
import OwnerBottomNav from "../component/OwnerBottomNav";
import axiosInstance from "../api/AxiosInstance";

const { width } = Dimensions.get("window");

export default function DashboardOwner({ navigation }) {
  const insets = useSafeAreaInsets();

  const [warung, setWarung] = useState(null);

  /* ================= LOAD DATA WARUNG ================= */
  useEffect(() => {
    loadWarung();
  }, []);

  const loadWarung = async () => {
    try {
      const res = await axiosInstance.get("/warung");

      console.log("DATA WARUNG DASHBOARD:", res.data);

      setWarung(res.data);
    } catch (error) {
      console.log("Gagal mengambil data warung");
    }
  };

  /* ================= URL FOTO ================= */
  const imageUrl =
    warung?.foto
      ? `http://192.168.1.11:8000/storage/${warung.foto}`
      : null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.headerTitle}>Beranda</Text>
        <TouchableOpacity style={styles.notifIcon}>
          <Ionicons name="notifications-outline" size={26} color="#000" />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* FOTO WARUNG */}
        <View style={styles.warungContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.warungImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("../../assets/profile.jpeg")}
              style={styles.warungImage}
              resizeMode="cover"
            />
          )}

          <Text style={styles.namaWarung}>
            {warung?.nama_warung || "Nama Warung"}
          </Text>

          <TouchableOpacity
            style={styles.kelolaButton}
            onPress={() => navigation.navigate("ProfileOwner")}
          >
            <Text style={styles.kelolaText}>Kelola Warung</Text>
          </TouchableOpacity>
        </View>

        {/* STOK BBM */}
        <View style={styles.stokContainer}>
          <Text style={styles.stokTitle}>Stok BBM</Text>

          <View style={styles.stokItem}>
            <Text style={styles.stokLabel}>Pertalite</Text>
            <Text style={styles.stokValue}>
              {warung?.stok_pertalite || 0} Liter
            </Text>
          </View>

          <View style={styles.stokItem}>
            <Text style={styles.stokLabel}>Pertamax</Text>
            <Text style={styles.stokValue}>
              {warung?.stok_pertamax || 0} Liter
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM NAV COMPONENT */}
      <OwnerBottomNav navigation={navigation} active="Dashboard" />
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
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 3,
  },

  stokLabel: {
    fontSize: width * 0.04,
  },

  stokValue: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#2E86DE",
  },
});