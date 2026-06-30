import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
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
    let subscription;

    const init = async () => {
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

    getRoute(loc.coords);
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

  const getRoute = async (coords) => {
    try {
      const start = `${coords.longitude},${coords.latitude}`;
      const end = `${parseFloat(warung.longitude)},${parseFloat(
        warung.latitude
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
        {/* 🌍 OpenTopoMap Tile */}
        <UrlTile
          urlTemplate="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          subdomains={["a", "b", "c"]}
        />

        {/* USER MARKER */}
        <Marker coordinate={location} title="Posisi Anda">
          <View style={styles.userDot} />
        </Marker>

        {/* WARUNG MARKER */}
        <Marker
          coordinate={{
            latitude: parseFloat(warung.latitude),
            longitude: parseFloat(warung.longitude),
          }}
          title="Warung"
        >
          <View style={styles.warungDot} />
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
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Jarak: {distance} km
        </Text>

        <Text style={styles.infoText}>
          Estimasi: {duration} menit
        </Text>

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
  container: { flex: 1 },
  map: { flex: 1 },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  userDot: {
    width: 16,
    height: 16,
    backgroundColor: "blue",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },

  warungDot: {
    width: 16,
    height: 16,
    backgroundColor: "red",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },

  infoBox: {
    position: "absolute",
    bottom: 30,
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