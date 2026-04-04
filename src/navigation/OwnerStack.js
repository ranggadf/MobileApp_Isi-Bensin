import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PesananOwnerScreen from "../owner/PesananOwnerScreen";
import DashboardOwner from "../owner/DashboardOwner";
import RiwayatOwnerScreen from "../owner/RiwayatOwnerScreen";
import ProfileOwnerScreen from "../owner/ProfileOwnerScreen";
import LoginScreen from "../../screens/LoginScreen";
import DetailPengantaran from "../owner/DetailPengantaran";
// nanti bisa tambah:
// import TambahProduk from "../owner/TambahProduk";
// import PesananMasuk from "../owner/PesananMasuk";
// import ProfileOwner from "../owner/ProfileOwner";

const Stack = createNativeStackNavigator();

export default function OwnerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardOwner" component={DashboardOwner} />
      <Stack.Screen name="PesananOwner" component={PesananOwnerScreen}/>
      <Stack.Screen name="RiwayatOwner" component={RiwayatOwnerScreen}  />
      <Stack.Screen name="ProfileOwner" component={ProfileOwnerScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="DetailPengantaran" component={DetailPengantaran} />



    </Stack.Navigator>
  );
}
