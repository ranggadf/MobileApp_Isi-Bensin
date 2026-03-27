import React, { useEffect, useState } from "react";
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

  const { warung } = route.params;

  const [location, setLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      alert("GPS harus diaktifkan");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});

    setLocation(loc.coords);

    getRoute(loc.coords);
  };

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

      setLoading(false);
    } catch (error) {
      console.log("ERROR ROUTE:", error);
      setLoading(false);
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
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >

        {/* Marker Customer */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Lokasi Anda"
        />

        {/* Marker Warung */}
        <Marker
          coordinate={{
            latitude: parseFloat(warung.latitude),
            longitude: parseFloat(warung.longitude),
          }}
          title={warung.nama_warung}
          pinColor="green"
        />

        {/* Garis Rute */}
        <Polyline
          coordinates={routeCoords}
          strokeWidth={5}
          strokeColor="#2563EB"
        />

      </MapView>

      {/* INFO ROUTE */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Jarak : {distance} km
        </Text>

        <Text style={styles.infoText}>
          Estimasi : {duration} menit
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