import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

import { MapPin } from "lucide-react-native";

import CustomerBottomNav from "../component/CustomerBottomNav";

export default function DashboardCustomerScreen() {
  const [dataWarung, setDataWarung] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  const navigation = useNavigation();

  // hitung jarak
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "GPS Tidak Aktif",
        "Mohon aktifkan GPS agar aplikasi dapat menampilkan warung terdekat."
      );
      return;
    }

    let location = await Location.getCurrentPositionAsync({});

    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setUserLocation(coords);

    return coords;
  };

  const loadWarung = async () => {
    try {
      const loc = await getLocation();

      const res = await axios.get("http://192.168.110.155:8000/api/warung");

      if (!Array.isArray(res.data)) {
        setDataWarung([]);
        setLoading(false);
        return;
      }

      const warungWithDistance = res.data.map((w) => {
        const distance = getDistance(
          loc.latitude,
          loc.longitude,
          w.latitude,
          w.longitude
        );

        return {
          ...w,
          jarak: distance,
        };
      });

      const sorted = warungWithDistance.sort((a, b) => a.jarak - b.jarak);

      const nearest = sorted.slice(0, 3);

      setDataWarung(nearest);

      setLoading(false);
    } catch (error) {
      console.log("ERROR AMBIL WARUNG:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarung();
  }, []);

  const renderWarung = ({ item }) => {
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: `http://10.80.2.103:8000/storage/${item.foto}`,
          }}
          style={styles.image}
        />

        <View style={styles.info}>
          <Text style={styles.nama}>{item.nama_warung}</Text>

          <Text style={styles.alamat}>{item.alamat}</Text>

          <Text style={styles.jarak}>
            📍 {item.jarak.toFixed(2)} km dari lokasi Anda
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("DetailWarung", {
                warung: item,
              })
            }
          >
            <Text style={styles.buttonText}>Lihat</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Temukan Warung Bensin</Text>

        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle}>
            Pilih warung terdekat dan pesan bensin dengan mudah
          </Text>

          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate("MapsScreen")}
          >
            <MapPin size={22} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={dataWarung}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWarung}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
  },

  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },

  subtitle: {
    flex: 1,
    color: "#64748b",
    marginRight: 10,
  },

  mapButton: {
    backgroundColor: "#E0ECFF",
    padding: 8,
    borderRadius: 10,
  },

  list: {
    paddingHorizontal: 15,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 160,
  },

  info: {
    padding: 12,
  },

  nama: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },

  alamat: {
    color: "#64748b",
    marginTop: 4,
  },

  jarak: {
    marginTop: 6,
    color: "#2563EB",
    fontWeight: "600",
  },

  button: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});