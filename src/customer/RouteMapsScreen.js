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
import {
  Map,
  Camera,
  Marker,
  GeoJSONSource,
  Layer,
} from "@maplibre/maplibre-react-native";

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
 const cameraRef = useRef(null); // referensi map (untuk animasi kamera)

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
    let subscription;

    const init = async () => {
        subscription = await startTracking();
    };

    init();

    return () => {
        subscription?.remove();
    };
}, []);


  // =========================
  // 🔹 TRACKING GPS REALTIME
  // =========================
  const startTracking = async () => {

    // minta izin akses lokasi ke user
    let { status } = await Location.requestForegroundPermissionsAsync();

   if (status !== "granted") {
    alert("GPS harus diaktifkan");
    setLoading(false);
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
    const subscription = await Location.watchPositionAsync(
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
      cameraRef.current?.setCamera({
    centerCoordinate: [
        coords.longitude,
        coords.latitude,
    ],
    zoomLevel: 15,
    animationDuration: 1000,
});
      }
    );
    return subscription;
  };


  // =========================
  // 🔹 AMBIL RUTE DARI API OSRM
  // =========================
  const getRoute = async (coords) => {
    try {

      // titik awal (user) format: longitude,latitude
      const start = `${coords.longitude},${coords.latitude}`;

      // titik tujuan (warung)
      const end =
`${parseFloat(warung.longitude)},${parseFloat(warung.latitude)}`;

      // API routing OSRM (gratis open source)
      const url =
        `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

      // request ke API
      const res = await axios.get(url);
if (!res.data.routes || res.data.routes.length === 0) {
    return;
}
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
 <Map
    style={styles.map}
    mapStyle="https://tiles.openfreemap.org/styles/liberty/style.json"
    compassEnabled
    rotateEnabled
    zoomEnabled
    scrollEnabled
    pitchEnabled
>

    {/* CAMERA */}
    <Camera
        ref={cameraRef}
        zoomLevel={15}
        centerCoordinate={[
            location.longitude,
            location.latitude,
        ]}
        animationMode="flyTo"
        animationDuration={0}
    />

    {/* MARKER USER */}
    <Marker
        id="user"
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={[
            location.longitude,
            location.latitude,
        ]}
    >
        <View
            style={{
                width: 18,
                height: 18,
                backgroundColor: "blue",
                borderRadius: 9,
                borderWidth: 2,
                borderColor: "#fff",
            }}
        />
    </Marker>

    {/* MARKER WARUNG */}
    <Marker
        id="warung"
        anchor={{ x: 0.5, y: 0.5 }}
        coordinate={[
            parseFloat(warung.longitude),
            parseFloat(warung.latitude),
        ]}
    >
        <View
            style={{
                width: 18,
                height: 18,
                backgroundColor: "red",
                borderRadius: 9,
                borderWidth: 2,
                borderColor: "#fff",
            }}
        />
    </Marker>

    {/* GARIS RUTE */}
   {routeCoords.length > 1 && (
<GeoJSONSource
    id="route"
    shape={{
        type:"Feature",
        geometry:{
            type:"LineString",
            coordinates:routeCoords.map(p=>[
                p.longitude,
                p.latitude,
            ]),
        },
    }}
>
    <Layer
        id="route-line"
        type="line"
        paint={{
            "line-color":"#2563EB",
            "line-width":5,
        }}
    />
</GeoJSONSource>
)}

</Map>


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