import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import api from "../api/AxiosInstance";

import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailPengantaran() {
  const route = useRoute();
  const navigation = useNavigation();
  const mapRef = useRef(null);

const { orderId } = route.params;

  const [location, setLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customerLocation, setCustomerLocation] = useState(null);

  useEffect(() => {
    let subscription;

    const init = async () => {
  await fetchOrder();
  subscription = await startTracking();
};
    init();

    return () => {
      subscription?.remove();
    };
  }, []);
 

  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("GPS harus diaktifkan");
      setLoading(false);
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);

    // 🔥 Kirim lokasi pertama ke server
await updateTracking(loc.coords);

// 🔥 Hitung rute
await getRoute(loc.coords);
    setLoading(false);

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000,
        distanceInterval: 5,
      },
      (newLoc) => {
        const coords = newLoc.coords;

        setLocation(coords);
        updateTracking(coords);
        getRoute(coords);

        // auto zoom ke user
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );

    return subscription;
  };

  const fetchOrder = async () => {
  try {
    const res = await api.get(`/owner/orders/${orderId}`);

    setCustomerLocation({
      latitude: parseFloat(res.data.lat),
      longitude: parseFloat(res.data.lng),
    });
  } catch (error) {
    console.log(error);
    Alert.alert("Error", "Gagal mengambil lokasi customer");
  }
};

const updateTracking = async (coords) => {
  try {
    await api.post(`/owner/orders/${orderId}/tracking`, {
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  } catch (err) {
    console.log("Tracking gagal", err.response?.data || err.message);
  }
};

  const getRoute = async (coords) => {
    if (!customerLocation) return;
    try {
      
      const start = `${coords.longitude},${coords.latitude}`;
      const end = `${parseFloat(customerLocation.longitude)},${parseFloat(
        customerLocation.latitude
      )}`;

      const url =
        `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

      const res = await axios.get(url);

      if (!res.data.routes || res.data.routes.length === 0) return;

      const data = res.data.routes[0];

      const points = data.geometry.coordinates.map((c) => ({
        latitude: c[1],
        longitude: c[0],
      }));

      setRouteCoords(points);
      setDistance((data.distance / 1000).toFixed(2));
      setDuration((data.duration / 60).toFixed(0));
    } catch (err) {
      console.log("ROUTE ERROR:", err);
    }
  };

if (loading || !location || !customerLocation) {
  return (
    <SafeAreaView style={styles.loading}>
      <ActivityIndicator size="large" color="#2563EB" />
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 🌍 OpenTopoMap Tile */}
        <UrlTile
          urlTemplate="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          subdomains={["a", "b", "c"]}
        />

        {/* USER MARKER */}
       <Marker coordinate={location} anchor={{ x: 0.5, y: 0.5 }}>
         <Image
           source={require("../../assets/custom.png")}
           style={{ width: 45, height: 45 }}
         />
       </Marker>

        {/* CUSTOMER MARKER */}
   <Marker coordinate={customerLocation} anchor={{ x: 0.5, y: 0.5 }}>
    <Image
      source={require("../../assets/usermark.png")}
      style={{ width: 45, height: 45 }}
    />
  </Marker>
        {/* ROUTE LINE */}
        {routeCoords.length > 1 && (
          <Polyline
            coordinates={routeCoords}
            strokeColor="#2563EB"
            strokeWidth={5}
          />
        )}
      </MapView>

      {/* INFO PANEL */}
     <View style={styles.estimateBox}>
  <Text style={styles.estimateTitle}>
    Estimasi Pengiriman
  </Text>

  <View style={styles.row}>
    <Text style={styles.label}>Jarak</Text>
    <Text style={styles.value}>
      {distance} km
    </Text>
  </View>

  <View style={styles.row}>
    <Text style={styles.label}>Estimasi</Text>
    <Text style={styles.value}>
      {duration} menit
    </Text>
  </View>

  <TouchableOpacity
    style={styles.backButton}
    onPress={() => navigation.goBack()}
  >
    <Text style={styles.backButtonText}>
      Kembali
    </Text>
  </TouchableOpacity>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  destinationIcon: {
  width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    borderWidth: 3,
    borderColor: "#FFFFFF",
},

  estimateBox: {
  position: "absolute",
  left: 20,
  right: 20,
  bottom: 30,
  backgroundColor: "#FFFFFF",
  borderRadius: 15,
  padding: 16,
  elevation: 8,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 8,
  shadowOffset: {
    width: 0,
    height: 3,
  },
},
 ownerMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2563EB",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  // Marker Customer
  customerMarker: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

estimateTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#111827",
  marginBottom: 12,
},

row: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
},

label: {
  fontSize: 15,
  color: "#6B7280",
},

value: {
  fontSize: 16,
  fontWeight: "bold",
  color: "#2563EB",
},

ownerIcon: {
  width: 55,
  height: 55,
},

destinationIcon: {
  width: 45,
  height: 45,
},

backButton: {
  marginTop: 15,
  backgroundColor: "#2563EB",
  borderRadius: 10,
  paddingVertical: 12,
  alignItems: "center",
},

backButtonText: {
  color: "#fff",
  fontWeight: "bold",
  fontSize: 16,
},

  // backButton: {
  //   marginTop: 10,
  //   backgroundColor: "#2563EB",
  //   padding: 10,
  //   borderRadius: 8,
  //   alignItems: "center",
  // },
});