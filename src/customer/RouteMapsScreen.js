import React, { useEffect, useRef, useState } from "react";

// komponen UI React Native
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

// komponen map (Google Maps / Apple Maps)
import MapView, { Marker, Polyline } from "react-native-maps";

// library untuk ambil lokasi GPS
import * as Location from "expo-location";

// untuk request API (ambil rute dari OSRM)
import axios from "axios";

// navigation (ambil parameter & pindah halaman)
import { useRoute, useNavigation } from "@react-navigation/native";

// safe area (biar tidak ketutup notch / status bar)
import { SafeAreaView } from "react-native-safe-area-context";

export default function RouteMapsScreen() {

  // =========================
  // 🔹 AMBIL DATA DARI HALAMAN SEBELUMNYA
  // =========================
  const route = useRoute(); // akses parameter route
  const navigation = useNavigation(); // navigasi antar halaman
  const mapRef = useRef(null); // referensi map (untuk animasi kamera)

  // data warung dikirim dari screen sebelumnya
  const { warung } = route.params;


  // =========================
  // 🔹 STATE (DATA DINAMIS)
  // =========================
  const [location, setLocation] = useState(null); // posisi user realtime
  const [routeCoords, setRouteCoords] = useState([]); // garis rute di map
  const [distance, setDistance] = useState(null); // jarak (km)
  const [duration, setDuration] = useState(null); // waktu (menit)
  const [loading, setLoading] = useState(true); // loading awal


  // =========================
  // 🔥 JALANKAN SAAT HALAMAN DIBUKA
  // =========================
  useEffect(() => {
    startTracking(); // mulai tracking GPS
  }, []);


  // =========================
  // 🔹 TRACKING GPS REALTIME
  // =========================
  const startTracking = async () => {

    // minta izin akses lokasi ke user
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("GPS harus diaktifkan");
      return;
    }

    // ambil posisi awal user
    let loc = await Location.getCurrentPositionAsync({});

    // simpan lokasi ke state
    setLocation(loc.coords);

    // ambil rute awal ke warung
    getRoute(loc.coords);

    setLoading(false); // matikan loading

    // =========================
    // 🔥 REALTIME TRACKING (bergerak terus)
    // =========================
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High, // akurasi tinggi
        timeInterval: 3000, // update tiap 3 detik
        distanceInterval: 5, // update jika pindah 5 meter
      },
      (newLoc) => {

        // ambil koordinat terbaru user
        const coords = newLoc.coords;

        // update posisi user
        setLocation(coords);

        // update rute ke warung setiap user bergerak
        getRoute(coords);

        // pindahkan kamera map mengikuti user
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );
  };


  // =========================
  // 🔹 AMBIL RUTE DARI API OSRM
  // =========================
  const getRoute = async (coords) => {
    try {

      // titik awal (user) format: longitude,latitude
      const start = `${coords.longitude},${coords.latitude}`;

      // titik tujuan (warung)
      const end = `${warung.longitude},${warung.latitude}`;

      // API routing OSRM (gratis open source)
      const url =
        `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

      // request ke API
      const res = await axios.get(url);

      // ambil data rute pertama
      const data = res.data.routes[0];

      // ubah format koordinat agar cocok dengan MapView
      const points = data.geometry.coordinates.map((coord) => ({
        latitude: coord[1],   // urutan dibalik
        longitude: coord[0],
      }));

      // simpan garis rute
      setRouteCoords(points);

      // hitung jarak (meter → km)
      setDistance((data.distance / 1000).toFixed(2));

      // hitung waktu (detik → menit)
      setDuration((data.duration / 60).toFixed(0));

    } catch (error) {
      console.log("ERROR ROUTE:", error);
    }
  };


  // =========================
  // 🔹 LOADING SCREEN
  // =========================
  if (loading || !location) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }


  // =========================
  // 🔹 UI MAP
  // =========================
  return (
    <SafeAreaView style={styles.container}>

      {/* MAP UTAMA */}
      <MapView
        ref={mapRef}
        style={styles.map}

        // posisi awal map
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* 🔵 MARKER USER */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Lokasi Anda"
          pinColor="blue"
        />

        {/* 🔴 MARKER WARUNG */}
        <Marker
          coordinate={{
            latitude: parseFloat(warung.latitude),
            longitude: parseFloat(warung.longitude),
          }}
          title={warung.nama_warung}
          pinColor="red"
        />

        {/* 🔵 GARIS RUTE */}
        <Polyline
          coordinates={routeCoords}
          strokeWidth={5}
          strokeColor="#2563EB"
        />

      </MapView>


      {/* INFO JARAK & WAKTU */}
      <View style={styles.infoBox}>

        <Text style={styles.infoText}>
          Jarak : {distance} km
        </Text>

        <Text style={styles.infoText}>
          Estimasi : {duration} menit
        </Text>

        {/* tombol kembali */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: "#fff" }}>Kembali</Text>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  infoBox: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 5,
  },

  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },

  backButton: {
    marginTop: 10,
    backgroundColor: "#2563EB",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});