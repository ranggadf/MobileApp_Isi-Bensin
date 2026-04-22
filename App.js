import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message"; // 🔥 TAMBAH INI

import { OrderProvider } from "./src/component/OrderContext";
import { CartProvider } from "./src/component/CartContext";

import OwnerStack from "./src/navigation/OwnerStack";
import AuthStack from "./src/navigation/AuthStack";
import CustomerStack from "./src/navigation/CustomerStack";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="AuthStack" component={AuthStack} />
              <Stack.Screen name="CustomerStack" component={CustomerStack} />
              <Stack.Screen name="OwnerStack" component={OwnerStack} />
            </Stack.Navigator>
          </NavigationContainer>

          {/* 🔥 WAJIB TARUH DI SINI */}
          <Toast />
        </OrderProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}