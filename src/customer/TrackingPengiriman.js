import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Image } from "react-native";
import MapView, {
  Marker,
  Polyline,
  UrlTile,
} from "react-native-maps";

import axios from "axios";
import api from "../api/AxiosInstance";

import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrackingPengiriman() {

    const route = useRoute();
    const { orderId } = route.params;

    const mapRef = useRef(null);

    const [ownerLocation, setOwnerLocation] = useState(null);
    const [customerLocation, setCustomerLocation] = useState(null);
    const [routeCoords, setRouteCoords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);

    useEffect(() => {

        fetchTracking();

        const interval = setInterval(() => {
            fetchTracking();
        }, 3000);

        return () => clearInterval(interval);

    }, []);

    const fetchTracking = async () => {

        try {

            const res = await api.get(
                `/customer/orders/${orderId}/tracking`
            );

            const data = res.data;

            if (
  data.owner_lat !== null &&
  data.owner_lng !== null
) {

                const owner = {
                    latitude: parseFloat(data.owner_lat),
                    longitude: parseFloat(data.owner_lng),
                };

                const customer = {
                    latitude: parseFloat(data.customer_lat),
                    longitude: parseFloat(data.customer_lng),
                };

        
                setOwnerLocation(owner);
setCustomerLocation(customer);

mapRef.current?.animateToRegion({
  latitude: owner.latitude,
  longitude: owner.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
});

getRoute(owner, customer);

setLoading(false);

               
            }

        } catch (err) {

            console.log(err);

        }

    };

    // getRoute() kita buat di langkah berikutnya


const getRoute = async (owner, customer) => {

    try {

        const start =
            `${owner.longitude},${owner.latitude}`;

        const end =
            `${customer.longitude},${customer.latitude}`;

        const url =
            `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

        const res = await axios.get(url);

        if (!res.data.routes.length) return;

        const data = res.data.routes[0];

        const points = data.geometry.coordinates.map((c) => ({
            latitude: c[1],
            longitude: c[0],
        }));

        setRouteCoords(points);

        setDistance(
            (data.distance / 1000).toFixed(2)
        );

        setDuration(
            (data.duration / 60).toFixed(0)
        );

    } catch (err) {

        console.log("ROUTE ERROR", err);

    }

};
if (loading || !ownerLocation || !customerLocation) {
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
        latitude: ownerLocation.latitude,
        longitude: ownerLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <UrlTile
        urlTemplate="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maximumZ={19}
        subdomains={["a", "b", "c"]}
      />

     <Marker coordinate={ownerLocation} anchor={{ x: 0.5, y: 0.5 }}>
  <Image
    source={require("../../assets/custom.png")}
    style={{ width: 45, height: 45 }}
  />
</Marker>

 <Marker coordinate={customerLocation} anchor={{ x: 0.5, y: 0.5 }}>
  <Image
    source={require("../../assets/usermark.png")}
    style={{ width: 45, height: 45 }}
  />
</Marker>

      {routeCoords.length > 1 && (
        <Polyline
          coordinates={routeCoords}
          strokeColor="#2563EB"
          strokeWidth={5}
        />
      )}
    </MapView>
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
</View>
  </SafeAreaView>
);
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  map: {
    flex: 1,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  estimateBox: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 90, // berada di atas tombol Home/Kembali
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

  // Marker Owner
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
});