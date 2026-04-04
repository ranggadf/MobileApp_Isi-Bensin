import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import api from "../api/AxiosInstance";

export default function DetailPengantaran({ route }) {
  const { orderId } = route.params;

  const [customerLocation, setCustomerLocation] = useState(null);
  const [ownerLocation, setOwnerLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    console.log("ORDER ID:", orderId);

    if (!orderId) {
      Alert.alert("Error", "Order ID tidak tersedia");
      setLoading(false);
      return;
    }

    fetchCustomerLocation();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        console.log("🛑 STOP TRACKING");
      }
    };
  }, []);

  // ================================
  // AMBIL DATA ORDER
  // ================================
  const fetchCustomerLocation = async () => {
    try {
      console.log("🔄 Fetching order detail...");

      const res = await api.get(`/owner/orders/${orderId}`);

      console.log("✅ RESPONSE ORDER:", res.data);

      const order = res.data;

      console.log("📍 LAT:", order.lat);
      console.log("📍 LNG:", order.lng);

      if (
        order.lat === null ||
        order.lng === null ||
        order.lat === undefined ||
        order.lng === undefined ||
        order.lat === "" ||
        order.lng === ""
      ) {
        console.log("❌ LAT/LNG INVALID");
        Alert.alert("Error", "Lokasi customer tidak tersedia");
        setLoading(false);
        return;
      }

      const custLoc = {
        latitude: parseFloat(order.lat),
        longitude: parseFloat(order.lng),
      };

      console.log("✅ CUSTOMER LOCATION:", custLoc);

      setCustomerLocation(custLoc);

      // 🔥 START REALTIME TRACKING
      startTrackingOwner(custLoc);
    } catch (error) {
      console.log("❌ ERROR FETCH ORDER:");
      console.log("MESSAGE:", error.message);
      console.log("RESPONSE:", error.response?.data);
      console.log("STATUS:", error.response?.status);

      Alert.alert("Error", "Gagal mengambil lokasi customer");
      setLoading(false);
    }
  };

  // ================================
  // TRACKING REALTIME OWNER
  // ================================
  const startTrackingOwner = async (custLoc) => {
    try {
      console.log("🚀 START TRACKING OWNER");

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("❌ IZIN DITOLAK");
        Alert.alert("Permission Denied", "Izin lokasi ditolak!");
        setLoading(false);
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 3000,
          distanceInterval: 5,
        },
        (loc) => {
          const newLoc = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          console.log("📍 OWNER GERAK:", newLoc);

          setOwnerLocation(newLoc);

          // 🔥 AUTO FOLLOW MAP
          mapRef.current?.animateToRegion({
            ...newLoc,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });

          // 🔥 UPDATE ROUTE
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

  // ================================
  // FETCH ROUTE
  // ================================
  const fetchRoute = async (start, end) => {
    try {
      console.log("🔄 Fetching route...");
      console.log("START:", start);
      console.log("END:", end);

      const url = `http://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(
          ([lon, lat]) => ({
            latitude: lat,
            longitude: lon,
          })
        );

        console.log("✅ ROUTE UPDATED:", coords.length);

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

  // ================================
  // LOADING
  // ================================
  if (loading || !ownerLocation || !customerLocation) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </SafeAreaView>
    );
  }

  // ================================
  // MAP VIEW
  // ================================
  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: ownerLocation.latitude,
          longitude: ownerLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={ownerLocation} title="Lokasi Owner" />
        <Marker
          coordinate={customerLocation}
          title="Lokasi Customer"
          pinColor="blue"
        />

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