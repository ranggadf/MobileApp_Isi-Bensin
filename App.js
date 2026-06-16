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

import {
  registerForPushNotificationsAsync,
} from "./src/component/notif";

const Stack = createNativeStackNavigator();

export default function App() {

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {

   async function init() {

  try {

    // ==============================
    // REGISTER TOKEN
    // ==============================
    const token =
      await registerForPushNotificationsAsync();

    console.log("TOKEN OWNER:", token);

    // ==============================
    // TEST NOTIF LOCAL
    // ==============================
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "TEST NOTIF",
        body: "Notif local berhasil",
        sound: "default",
      },
      trigger: null,
    });

    // ==============================
    // LISTENER SAAT NOTIF MASUK
    // ==============================
    notificationListener.current =
      Notifications.addNotificationReceivedListener(
        (notification) => {

          console.log(
            "NOTIF MASUK:",
            notification
          );
        }
      );

    // ==============================
    // LISTENER SAAT NOTIF DIKLIK
    // ==============================
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {

          console.log(
            "NOTIF DIKLIK:",
            response
          );
        }
      );

  } catch (error) {

    console.log(
      "ERROR INIT NOTIFICATION:",
      error
    );
  }
}

    init();

    // ==============================
    // CLEANUP LISTENER
    // ==============================
        // ==============================
    // CLEANUP LISTENER
    // ==============================
    return () => {

      notificationListener.current?.remove();

      responseListener.current?.remove();
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