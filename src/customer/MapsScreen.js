import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

export default function MapsScreen() {
  const navigation = useNavigation();

  const warung = [
    { id: 1, nama: "Warung A", lat: -7.6305, lng: 111.5231 },
    { id: 2, nama: "Warung B", lat: -7.6269, lng: 111.5300 },
    { id: 3, nama: "Warung C", lat: -7.6180, lng: 111.5210 },
    { id: 4, nama: "Warung D", lat: -7.6235, lng: 111.5405 },
  ];

  return (
    <View style={styles.container}>
      {/* Tombol Kembali */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Kembali</Text>
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -7.6297, // Kota Madiun
          longitude: 111.5231,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Tile OpenTopoMap */}
        <UrlTile
          urlTemplate="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          maximumZ={17}
          flipY={false}
          subdomains={["a", "b", "c"]}
        />

        {/* Marker warung */}
        {warung.map((item) => (
          <Marker
            key={item.id}
            coordinate={{
              latitude: item.lat,
              longitude: item.lng,
            }}
            title={item.nama}
            description="Warung Bensin 24 Jam"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 15,
    zIndex: 999,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 5,
  },
  backText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
