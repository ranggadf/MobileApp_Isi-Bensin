import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../src/api/config";
import { Ionicons } from "@expo/vector-icons";
import { registerForPushNotificationsAsync } 
from "../src/component/notif";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
  setError("");

  if (!email || !password) {
    setError("Email dan password wajib diisi");
    return;
  }

  try {

    // LOGIN
    const res = await axios.post(API.LOGIN, {
      email,
      password,
    });

    if (res.data.success) {

      // TOKEN LOGIN
      // TOKEN LOGIN
const authToken = res.data.token;

// DATA USER
const user = res.data.data;

// SIMPAN TOKEN DAN ROLE
await AsyncStorage.setItem("token", authToken);
await AsyncStorage.setItem("role", user.role.toString());

      // =========================
      // SIMPAN EXPO TOKEN
      // =========================
      try {

        const expoToken =
          await registerForPushNotificationsAsync();

        console.log("EXPO TOKEN:", expoToken);

        await axios.post(
    "http://192.168.1.7:8000/api/save-expo-token",
          {
            user_id: user.id,
            expo_token: expoToken,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log("TOKEN BERHASIL DISIMPAN");

      } catch (notifError) {

  console.log("ERROR SAVE TOKEN FULL:");

  console.log(notifError);

  console.log("RESPONSE:");
  console.log(notifError.response?.data);

  console.log("MESSAGE:");
  console.log(notifError.message);
}

      // =========================
      // NAVIGASI
      // =========================
      if (user.role === 1) {
        navigation.replace("CustomerStack");
      } else if (user.role === 2) {
        navigation.replace("OwnerStack");
      }
    }

  } catch (err) {

    console.log(err.response?.data || err);

    setError("Email atau password salah");
  }
};

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.jpeg")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      {/* EMAIL */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon}/>
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* PASSWORD */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.icon}/>
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {/* ERROR */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>

      {/* REGISTER */}
     <View style={styles.registerContainer}>
  <Text style={styles.registerText}>Belum punya akun?</Text>
<TouchableOpacity onPress={() => navigation.navigate("RegisterChoice")}>
  <Text style={styles.registerLink}> Daftar</Text>
</TouchableOpacity>
</View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 25,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
  },

  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },

  registerText: {
    fontSize: 14,
    color: "#555",
  },

  registerLink: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});