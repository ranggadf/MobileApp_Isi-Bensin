import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Handler notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    // =========================
    // ANDROID CHANNEL
    // =========================
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        sound: "alarm",
        enableLights: true,
        enableVibrate: true,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    // =========================
    // DEVICE CHECK
    // =========================
    if (!Device.isDevice) {
      alert("Harus menggunakan device fisik");
      return null;
    }

    // =========================
    // PERMISSION
    // =========================
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();

      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Izin notifikasi ditolak");
      return null;
    }

    // =========================
    // GET TOKEN
    // =========================
    const tokenData =
      await Notifications.getExpoPushTokenAsync({
        projectId:
          Constants.expoConfig?.extra?.eas?.projectId,
      });

    const token = tokenData.data;

    console.log("EXPO TOKEN:", token);

    return token;

  } catch (error) {
    console.log("REGISTER NOTIFICATION ERROR:", error);
    return null;
  }
}