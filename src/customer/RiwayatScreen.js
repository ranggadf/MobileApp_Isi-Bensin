import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import CustomerBottomNav from "../component/CustomerBottomNav";
import api from "../api/AxiosInstance";

const { height } = Dimensions.get("window");
const CARD_HEIGHT = (height - 200) / 4;

export default function RiwayatScreen() {
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FILTER
  const currentDate = new Date();

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    fetchRiwayat();

    const interval = setInterval(fetchRiwayat, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchRiwayat = async () => {
    try {
      const response = await api.get("/my-orders");

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const filtered = data.filter((order) => {
        const status = order.status?.toLowerCase();

        return (
          status === "selesai" ||
          status === "ditolak" ||
          status === "expired"
        );
      });

      setRiwayatData(filtered);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

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
    const currentYear = new Date().getFullYear();

    const yearList = [];

    for (
      let i = currentYear - 0;
      i <= currentYear + 10;
      i++
    ) {
      yearList.push(i);
    }

    return yearList.reverse();
  }, []);

  // 🔥 FILTER DATA
  const filteredRiwayat = riwayatData.filter((item) => {
    const date = new Date(item.created_at);

    const itemMonth = date.getMonth() + 1;
    const itemYear = date.getFullYear();

    const matchMonth =
      selectedMonth === 0 ||
      itemMonth === selectedMonth;

    const matchYear =
      itemYear === selectedYear;

    return matchMonth && matchYear;
  });

  // 🔥 DELETE
  const handleDelete = (id) => {
    Alert.alert(
      "Hapus Riwayat",
      "Yakin ingin menghapus riwayat ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/orders/${id}`);

              setRiwayatData((prev) =>
                prev.filter(
                  (item) => item.id !== id
                )
              );
            } catch (err) {
              console.log(
                err.response?.data || err
              );
            }
          },
        },
      ]
    );
  };

  // 🔥 LABEL STATUS
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "expired":
        return "Kadaluarsa";

      case "ditolak":
        return "Ditolak";

      case "selesai":
        return "Selesai";

      default:
        return status;
    }
  };

  // 🔥 STYLE STATUS
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "ditolak":
        return {
          color: "#EF4444",
          bg: "#fee2e2",
        };

      case "expired":
        return {
          color: "#6B7280",
          bg: "#e5e7eb",
        };

      case "selesai":
        return {
          color: "#16A34A",
          bg: "#dcfce7",
        };

      default:
        return {
          color: "#64748b",
          bg: "#f1f5f9",
        };
    }
  };

  const renderItem = ({ item }) => {
    const status = item.status;
    const label = getStatusLabel(status);
    const statusStyle = getStatusStyle(status);

    return (
      <View
        style={[
          styles.card,
          { height: CARD_HEIGHT },
        ]}
      >
        {/* TOP */}
        <View style={styles.topRow}>
          <Text
            style={styles.name}
            numberOfLines={1}
          >
            {item?.warung?.nama_warung ||
              "Warung"}
          </Text>

          <Text
            style={[
              styles.status,
              {
                color: statusStyle.color,
                backgroundColor:
                  statusStyle.bg,
              },
            ]}
          >
            {label}
          </Text>
        </View>

        {/* ITEM */}
        {Array.isArray(item.items) &&
          item.items.length > 0 && (
            <Text style={styles.itemText}>
              {item.items[0].jenis_bbm} •{" "}
              {item.items[0].qty}L
            </Text>
          )}

        {/* BOTTOM */}
        <View style={styles.bottomRow}>
          <Text style={styles.total}>
            Rp {item.total_harga}
          </Text>

          <View style={styles.rightSection}>
            <Text style={styles.time}>
              {new Date(
                item.created_at
              ).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                handleDelete(item.id)
              }
            >
              <Text style={styles.deleteText}>
                Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const selectedMonthLabel =
    months.find(
      (m) => m.value === selectedMonth
    )?.label || "Semua";

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>
            Riwayat Pesanan
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

        {/* 🔥 INFO FILTER */}
        <Text style={styles.filterInfo}>
          {selectedMonthLabel}{" "}
          {selectedYear}
        </Text>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#2563EB"
          />
        </View>
      ) : filteredRiwayat.length === 0 ? (
        <View style={styles.loading}>
          <Text style={styles.empty}>
            Belum ada riwayat
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRiwayat}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 120,
          }}
        />
      )}

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

      {/* NAVBAR */}
      <CustomerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  header: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 22,
    color: "#1e293b",
    fontWeight: "bold",
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
    color: "#64748b",
    fontSize: 13,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 12,
    borderRadius: 14,
    justifyContent: "center",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  name: {
    color: "#1e293b",
    fontWeight: "bold",
    fontSize: 15,
    flex: 1,
    marginRight: 8,
  },

  status: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },

  itemText: {
    fontSize: 13,
    color: "#475569",
  },

  total: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "bold",
  },

  time: {
    fontSize: 12,
    color: "#64748b",
  },

  deleteBtn: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  deleteText: {
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "600",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  empty: {
    color: "#64748b",
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