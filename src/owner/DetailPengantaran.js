import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";

import api from "../api/AxiosInstance";

export default function DetailPengantaran({ route, navigation }) {

  const { orderId } = route.params;

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!orderId) {
      Alert.alert("Error", "Order ID tidak tersedia");
      navigation.goBack();
      return;
    }

    openGoogleMaps();

  }, []);

  const openGoogleMaps = async () => {

    try {

      const res = await api.get(`/owner/orders/${orderId}`);

      const order = res.data;

      if (!order.lat || !order.lng) {
        Alert.alert("Error", "Lokasi customer tidak tersedia");
        navigation.goBack();
        return;
      }

      const latitude = parseFloat(order.lat);
      const longitude = parseFloat(order.lng);

      const url =
        `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Google Maps tidak tersedia");
      }

    } catch (error) {

      console.log(error);

      Alert.alert("Error", "Gagal mengambil lokasi customer");

    } finally {

      setLoading(false);

      navigation.goBack();

    }

  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#2ECC71" />
    </SafeAreaView>
  );

}