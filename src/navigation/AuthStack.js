import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../../screens/LoginScreen";
import RegisterChoiceScreen from "../../screens/RegisterChoiceScreen";
import CustomerRegisterScreen from "../../screens/CustomerRegisterScreen";
import OwnerRegisterScreen from "../../screens/OwnerRegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterChoice" component={RegisterChoiceScreen} />
      <Stack.Screen name="RegisterPelanggan" component={CustomerRegisterScreen} />
      <Stack.Screen name="RegisterPemilik" component={OwnerRegisterScreen} />
    </Stack.Navigator>
  );
}
