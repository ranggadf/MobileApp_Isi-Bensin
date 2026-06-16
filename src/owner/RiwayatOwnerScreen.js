import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import OwnerBottomNav from "../component/OwnerBottomNav";
import api from "../api/AxiosInstance";

export default function RiwayatOwnerScreen({
  navigation,
}) {
  const [dataRiwayat, setDataRiwayat] =
    useState([]);

  const [filterVisible, setFilterVisible] =
    useState(false);

  // 🔥 FILTER
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] =
    useState(currentDate.getMonth() + 1);

  const [selectedYear, setSelectedYear] =
    useState(currentDate.getFullYear());

  // ================= FETCH RIWAYAT =================
  const fetchRiwayat = async () => {
    try {
      const res = await api.get(
        "/owner/riwayat"
      );

      setDataRiwayat(res.data);
    } catch (error) {
      console.log(
        "Error fetch riwayat:",
        error.message
      );
    }
  };

  useEffect(() => {
    fetchRiwayat();
  }, []);

  // 🔥 LIST BULAN
  const months = [
    { label: "Semua", value: 0 },
    { label: "Jan", value: 1 },
    { label: "Feb", value: 2 },
    { label: "Mar", value: 3 },
    { label: "Apr", value: 4 },
    { label: "Mei", value: 5 },
    { label: "Jun", value: 6 },
    { label: "Jul", value: 7 },
    { label: "Agu", value: 8 },
    { label: "Sep", value: 9 },
    { label: "Okt", value: 10 },
    { label: "Nov", value: 11 },
    { label: "Des", value: 12 },
  ];

  // 🔥 LIST TAHUN
  const years = useMemo(() => {
    const currentYear =
      new Date().getFullYear();

    const yearList = [];

    for (
      let i = currentYear - 10;
      i <= currentYear + 10;
      i++
    ) {
      yearList.push(i);
    }

    return yearList.reverse();
  }, []);

  // 🔥 FILTER DATA
  const filteredRiwayat =
    dataRiwayat.filter((item) => {
      const date = new Date(
        item.created_at
      );

      const itemMonth =
        date.getMonth() + 1;

      const itemYear =
        date.getFullYear();

      const matchMonth =
        selectedMonth === 0 ||
        itemMonth === selectedMonth;

      const matchYear =
        itemYear === selectedYear;

      return matchMonth && matchYear;
    });

  // ================= RENDER ITEM =================
  const renderItem = ({ item }) => {
    const statusLabel =
      item.status === "expired"
        ? "KADALUARSA"
        : item.status === "ditolak"
        ? "DITOLAK"
        : item.status === "selesai"
        ? "SELESAI"
        : item.status;

    return (
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.rowBetween}>
          <Text style={styles.nama}>
            {item.user?.nama || "-"}
          </Text>

          <Text
            style={[
              styles.status,
              item.status === "selesai"
                ? styles.statusSuccess
                : item.status ===
                    "expired" ||
                  item.status ===
                    "ditolak"
                ? styles.statusReject
                : styles.statusPending,
            ]}
          >
            {statusLabel}
          </Text>
        </View>

        {/* DETAIL */}
        <Text style={styles.detail}>
          {(item.items || [])
            .map(
              (i) =>
                `${i.jenis_bbm} • ${i.qty} L`
            )
            .join(", ")}
        </Text>

        {/* TANGGAL */}
        <Text style={styles.tanggal}>
          {new Date(
            item.created_at
          ).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    );
  };

  const selectedMonthLabel =
    months.find(
      (m) => m.value === selectedMonth
    )?.label || "Semua";

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>
            Riwayat Transaksi
          </Text>

          {/* 🔥 FILTER BUTTON */}
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() =>
              setFilterVisible(true)
            }
          >
            <Ionicons
              name="options-outline"
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* 🔥 FILTER INFO */}
        <Text style={styles.filterInfo}>
          {selectedMonthLabel}{" "}
          {selectedYear}
        </Text>
      </View>

      {/* LIST */}
      <FlatList
        data={filteredRiwayat}
        keyExtractor={(item) =>
          item.id.toString()
        }
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={
          false
        }
        onRefresh={fetchRiwayat}
        refreshing={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Belum ada riwayat transaksi
          </Text>
        }
      />

      {/* 🔥 MODAL FILTER */}
      <Modal
        visible={filterVisible}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Filter Riwayat
            </Text>

            {/* BULAN */}
            <Text style={styles.sectionTitle}>
              Bulan
            </Text>

            <View
              style={styles.dropdownWrapper}
            >
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(value) =>
                  setSelectedMonth(value)
                }
              >
                {months.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>

            {/* TAHUN */}
            <Text style={styles.sectionTitle}>
              Tahun
            </Text>

            <View
              style={styles.dropdownWrapper}
            >
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) =>
                  setSelectedYear(value)
                }
              >
                {years.map((year) => (
                  <Picker.Item
                    key={year}
                    label={year.toString()}
                    value={year}
                  />
                ))}
              </Picker>
            </View>

            {/* RESET */}
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSelectedMonth(0);

                setSelectedYear(
                  new Date().getFullYear()
                );
              }}
            >
              <Text style={styles.resetText}>
                Reset Filter
              </Text>
            </TouchableOpacity>

            {/* CLOSE */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() =>
                setFilterVisible(false)
              }
            >
              <Text style={styles.closeText}>
                Terapkan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <OwnerBottomNav
        navigation={navigation}
        active="Riwayat"
      />
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
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  filterBtn: {
    backgroundColor: "#2563EB",
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  filterInfo: {
    marginTop: 8,
    color: "#6B7280",
    fontSize: 13,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6B7280",
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nama: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },

  detail: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
  },

  tanggal: {
    marginTop: 6,
    fontSize: 12,
    color: "#999",
  },

  status: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },

  statusSuccess: {
    backgroundColor: "#D4EFDF",
    color: "#27AE60",
  },

  statusReject: {
    backgroundColor: "#FADBD8",
    color: "#C0392B",
  },

  statusPending: {
    backgroundColor: "#FCF3CF",
    color: "#F1C40F",
  },

  // 🔥 MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 10,
    marginTop: 8,
  },

  dropdownWrapper: {
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
  },

  resetBtn: {
    backgroundColor: "#E2E8F0",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 6,
  },

  resetText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 14,
  },

  closeBtn: {
    marginTop: 14,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});