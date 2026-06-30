import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import { OrderProvider } from "./src/component/OrderContext";
import { CartProvider } from "./src/component/CartContext";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {navigationRef,navigate,} from "./src/navigation/RootNavigation";
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
  const [loading, setLoading] = useState(true);
const [initialStack, setInitialStack] = useState("AuthStack");

  useEffect(() => {
  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    const role = await AsyncStorage.getItem("role");

    if (token) {
      if (role === "1") {
        setInitialStack("CustomerStack");
      } else if (role === "2") {
        setInitialStack("OwnerStack");
      }
    } else {
      setInitialStack("AuthStack");
    }

    setLoading(false);
  };

  checkLogin();
}, []);
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
    const data = response.notification.request.content.data;

    console.log("NOTIFICATION CLICKED:", data);

    if (data?.order_id) {
      navigate("OwnerStack", {
        screen: "PesananOwner",
        params: {
          orderId: data.order_id,
        },
      });
    }
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

  if (loading) {
  return null;
}

  return (
    <SafeAreaProvider>
      <CartProvider>
        <OrderProvider>
          <NavigationContainer ref={navigationRef}>
           <Stack.Navigator
    initialRouteName={initialStack}
    screenOptions={{
        headerShown:false
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