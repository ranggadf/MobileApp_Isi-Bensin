import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RouteMapsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const { warung } = route.params;

  const [location, setLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    startTracking();
  }, []);

  // 🔥 TRACKING REALTIME
  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("GPS harus diaktifkan");
      return;
    }

    // ambil posisi awal
    let loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
    getRoute(loc.coords);
    setLoading(false);

    // 🔥 watch position (REALTIME)
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000, // update tiap 3 detik
        distanceInterval: 5, // update jika pindah 5 meter
      },
      (newLoc) => {
        const coords = newLoc.coords;

        setLocation(coords);

        // 🔥 update rute setiap bergerak
        getRoute(coords);

        // 🔥 auto follow camera
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    );
  };

  // 🔥 GET ROUTE DYNAMIC
  const getRoute = async (coords) => {
    try {
      const start = `${coords.longitude},${coords.latitude}`;
      const end = `${warung.longitude},${warung.latitude}`;

      const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

      const res = await axios.get(url);

      const data = res.data.routes[0];

      const points = data.geometry.coordinates.map((coord) => ({
        latitude: coord[1],
        longitude: coord[0],
      }));

      setRouteCoords(points);
      setDistance((data.distance / 1000).toFixed(2));
      setDuration((data.duration / 60).toFixed(0));
    } catch (error) {
      console.log("ERROR ROUTE:", error);
    }
  };

  if (loading || !location) {
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
        {/* 🔵 Marker Customer (bergerak) */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Lokasi Anda"
        />

        {/* 🟡 Marker Warung */}
        <Marker
          coordinate={{
            latitude: parseFloat(warung.latitude),
            longitude: parseFloat(warung.longitude),
          }}
          title={warung.nama_warung}
          pinColor="yellow"
        />

        {/* 🔵 Garis Rute */}
        <Polyline
          coordinates={routeCoords}
          strokeWidth={5}
          strokeColor="#2563EB"
        />
      </MapView>

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Jarak : {distance} km</Text>
        <Text style={styles.infoText}>Estimasi : {duration} menit</Text>

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