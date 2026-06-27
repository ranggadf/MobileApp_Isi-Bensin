import React, { useEffect, useRef } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SafeAreaProvider } from "react-native-safe-area-context";

import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";

import { OrderProvider } from "./src/component/OrderContext";
import { CartProvider } from "./src/component/CartContext";

import OwnerStack from "./src/navigation/OwnerStack";
import AuthStack from "./src/navigation/AuthStack";
import CustomerStack from "./src/navigation/CustomerStack";

const Stack = createNativeStackNavigator();

/**
 * Agar notifikasi tetap muncul saat aplikasi sedang dibuka
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    // Saat notifikasi diterima
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("NOTIFICATION RECEIVED:");
        console.log(notification);
      });

    // Saat notifikasi ditekan
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("NOTIFICATION CLICKED:");
        console.log(response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }

      if (responseListener.current) {
        Notifications.removeNotificationSubscription(
          responseListener.current
        );
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen
                name="AuthStack"
                component={AuthStack}
              />

              <Stack.Screen
                name="CustomerStack"
                component={CustomerStack}
              />

              <Stack.Screen
                name="OwnerStack"
                component={OwnerStack}
              />
            </Stack.Navigator>
          </NavigationContainer>

          <Toast />
        </OrderProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}