import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OwnerBottomNav from "../component/OwnerBottomNav";

export default function PesananOwnerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesanan Pelanggan</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Detail Pesanan</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Nama Pelanggan</Text>
            <Text style={styles.value}>Budi Santoso</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jenis BBM</Text>
            <Text style={styles.value}>Pertalite</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Jumlah</Text>
            <Text style={styles.value}>20 Liter</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.value}>
              Jl. Soekarno Hatta No. 10
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Metode Pembayaran</Text>
            <Text style={styles.value}>Transfer</Text>
          </View>
        </View>

        {/* BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.rejectButton}>
            <Text style={styles.rejectText}>Tolak</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.confirmButton}>
            <Text style={styles.confirmText}>Konfirmasi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* BOTTOM NAV COMPONENT */}
      <OwnerBottomNav navigation={navigation} active="Pesanan" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },

  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 120, // supaya tidak ketutup bottom nav
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },

  row: {
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: "#888",
  },

  value: {
    fontSize: 15,
    fontWeight: "bold",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  rejectButton: {
    flex: 1,
    backgroundColor: "#E74C3C",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  confirmButton: {
    flex: 1,
    backgroundColor: "#2ECC71",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  rejectText: {
    color: "#fff",
    fontWeight: "bold",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
});