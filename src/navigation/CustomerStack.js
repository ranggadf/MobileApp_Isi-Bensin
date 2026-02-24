import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardCustomer from "../customer/DashboardCustomer";
import KeranjangScreen from "../customer/KeranjangScreen";
import PesananScreen from "../customer/PesananScreen";
import RiwayatScreen from "../customer/RiwayatScreen";
import ProfileScreen from "../customer/ProfileScreen";
import DetailWarung from "../customer/DetailWarung";
import MapsScreen from "../customer/MapsScreen";

const Stack = createNativeStackNavigator();

export default function CustomerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardCustomer" component={DashboardCustomer} />
      <Stack.Screen name="KeranjangScreen" component={KeranjangScreen} />
      <Stack.Screen name="PesananScreen" component={PesananScreen} />
      <Stack.Screen name="RiwayatScreen" component={RiwayatScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="DetailWarung" component={DetailWarung} />
      <Stack.Screen name="MapsScreen" component={MapsScreen} />
    </Stack.Navigator>
  );
}
