import React, { useEffect, useState, useRef } from "react";

// komponen UI React Native
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";

// Map Google Maps / Apple Maps
import MapView, { Marker, Polyline } from "react-native-maps";

// GPS tracking dari Expo
import * as Location from "expo-location";

// axios instance (Laravel backend)
import api from "../api/AxiosInstance";

export default function DetailPengantaran({ route }) {

  // =========================
  // 🔹 AMBIL PARAMETER ORDER ID
  // =========================
  const { orderId } = route.params;

  // =========================
  // 🔹 STATE MANAGEMENT
  // =========================
  const [customerLocation, setCustomerLocation] = useState(null); // lokasi customer
  const [ownerLocation, setOwnerLocation] = useState(null); // lokasi driver/owner
  const [routeCoords, setRouteCoords] = useState([]); // garis rute
  const [loading, setLoading] = useState(true); // loading screen

  // referensi map untuk animasi kamera
  const mapRef = useRef(null);

  // menyimpan listener GPS realtime
  const locationSubscription = useRef(null);


  // =========================
  // 🔥 JALANKAN SAAT HALAMAN DIBUKA
  // =========================
  useEffect(() => {
    console.log("ORDER ID:", orderId);

    // validasi order id
    if (!orderId) {
      Alert.alert("Error", "Order ID tidak tersedia");
      setLoading(false);
      return;
    }

    // ambil data lokasi customer
    fetchCustomerLocation();

    // cleanup saat halaman ditutup
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove(); // stop GPS tracking
        console.log("🛑 STOP TRACKING");
      }
    };
  }, []);


  // =========================
  // 🔹 AMBIL DATA CUSTOMER DARI BACKEND
  // =========================
  const fetchCustomerLocation = async () => {
    try {
      console.log("🔄 Fetching order detail...");

      // request ke Laravel API
      const res = await api.get(`/owner/orders/${orderId}`);

      const order = res.data;

      console.log("📍 LAT:", order.lat);
      console.log("📍 LNG:", order.lng);

      // validasi lokasi
      if (!order.lat || !order.lng) {
        Alert.alert("Error", "Lokasi customer tidak tersedia");
        setLoading(false);
        return;
      }

      // ubah ke format angka
      const custLoc = {
        latitude: parseFloat(order.lat),
        longitude: parseFloat(order.lng),
      };

      console.log("✅ CUSTOMER LOCATION:", custLoc);

      // simpan lokasi customer
      setCustomerLocation(custLoc);

      // mulai tracking lokasi owner
      startTrackingOwner(custLoc);

    } catch (error) {
      console.log("❌ ERROR FETCH ORDER:", error);
      Alert.alert("Error", "Gagal mengambil lokasi customer");
      setLoading(false);
    }
  };


  // =========================
  // 🔥 TRACKING REALTIME OWNER (DRIVER)
  // =========================
  const startTrackingOwner = async (custLoc) => {
    try {
      console.log("🚀 START TRACKING OWNER");

      // minta izin GPS
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied", "Izin lokasi ditolak!");
        setLoading(false);
        return;
      }

      // =========================
      // 🔥 REALTIME GPS WATCHER
      // =========================
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // GPS presisi tinggi
          timeInterval: 3000, // update tiap 3 detik
          distanceInterval: 5, // update jika pindah 5 meter
        },
        (loc) => {

          // ambil lokasi terbaru owner
          const newLoc = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          console.log("📍 OWNER GERAK:", newLoc);

          // simpan lokasi owner
          setOwnerLocation(newLoc);

          // =========================
          // 🔥 AUTO FOLLOW MAP CAMERA
          // =========================
          mapRef.current?.animateToRegion({
            ...newLoc,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          // =========================
          // 🔥 UPDATE ROUTE KE CUSTOMER
          // =========================
          if (custLoc) {
            fetchRoute(newLoc, custLoc);
          }
        }
      );

    } catch (error) {
      console.log("❌ ERROR TRACKING:", error);
      Alert.alert("Error", "Gagal tracking lokasi owner");
      setLoading(false);
    }
  };


  // =========================
  // 🔥 AMBIL RUTE DARI OSRM API
  // =========================
  const fetchRoute = async (start, end) => {
    try {
      console.log("🔄 Fetching route...");

      // format URL routing (start → end)
      const url =
        `http://router.project-osrm.org/route/v1/driving/` +
        `${start.longitude},${start.latitude};${end.longitude},${end.latitude}` +
        `?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      // cek jika route tersedia
      if (data.routes && data.routes.length > 0) {

        // ubah format koordinat OSRM ke MapView
        const coords = data.routes[0].geometry.coordinates.map(
          ([lon, lat]) => ({
            latitude: lat,
            longitude: lon,
          })
        );

        console.log("✅ ROUTE UPDATED:", coords.length);

        // simpan garis rute
        setRouteCoords(coords);

      } else {
        console.log("❌ ROUTE TIDAK ADA");
      }

    } catch (error) {
      console.log("❌ ERROR FETCH ROUTE:", error);
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // 🔥 LOADING SCREEN
  // =========================
  if (loading || !ownerLocation || !customerLocation) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </SafeAreaView>
    );
  }


  // =========================
  // 🔥 UI MAP
  // =========================
  return (
    <SafeAreaView style={styles.container}>

      {/* MAP VIEW */}
      <MapView
        ref={mapRef}
        style={styles.map}

        // posisi awal map (owner)
        initialRegion={{
          latitude: ownerLocation.latitude,
          longitude: ownerLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >

        {/* 🔵 MARKER OWNER (driver) */}
        <Marker coordinate={ownerLocation} title="Lokasi Owner" />

        {/* 🔴 MARKER CUSTOMER */}
        <Marker
          coordinate={customerLocation}
          title="Lokasi Customer"
          pinColor="blue"
        />

        {/* 🟢 GARIS RUTE REALTIME */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#2ECC71"
          />
        )}

      </MapView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: { flex: 1 },
});