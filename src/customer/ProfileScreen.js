import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import CustomerBottomNav from "../component/CustomerBottomNav";
import axiosInstance from "../api/AxiosInstance";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [noHp, setNoHp] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    loadCustomer();
  }, []);

  const loadCustomer = async () => {
    try {
      const res = await axiosInstance.get("/user");
      const user = res.data.data ? res.data.data : res.data;

      setCustomer(user);
      setNama(user.nama);
      setEmail(user.email);
      setNoHp(user.no_hp);
    } catch (error) {
      console.log("Gagal ambil data customer");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        nama: nama,
        email: email,
        no_hp: noHp,
      };

      if (password !== "") {
        payload.password = password;
      }

      await axiosInstance.put("/user", payload);

      Alert.alert("Berhasil", "Data akun berhasil diperbarui");
      setEditMode(false);
      setPassword("");
      loadCustomer();
    } catch (error) {
      Alert.alert("Error", "Gagal update data");
    }
  };

const handleLogout = async () => {
  Alert.alert(
    "Keluar",
    "Yakin ingin keluar dari akun?",
    [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          try {
            // 🔥 OPTIONAL
            // kalau ada endpoint logout Laravel
            // await axiosInstance.post("/logout");

            // 🔥 HAPUS STORAGE
            await AsyncStorage.clear();

            // 🔥 RESET NAVIGATION
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "AuthStack",
                },
              ],
            });
          } catch (error) {
            Alert.alert(
              "Error",
              "Keluar gagal"
            );
          }
        },
      },
    ]
  );
};

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Data Akun</Text>

          {/* Nama */}
          <Text style={styles.label}>Nama</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={nama}
              onChangeText={setNama}
            />
          ) : (
            <Text style={styles.value}>{customer?.nama}</Text>
          )}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <Text style={styles.value}>{customer?.email}</Text>
          )}

          {/* No HP */}
          <Text style={styles.label}>No HP</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={noHp}
              onChangeText={setNoHp}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{customer?.no_hp}</Text>
          )}

        {/* Password */}
<Text style={styles.label}>Password</Text>

{editMode ? (
  <View style={styles.passwordContainer}>
    <TextInput
      style={styles.passwordInput}
      placeholder="Masukkan password baru"
      secureTextEntry={!showPassword}
      value={password}
      onChangeText={setPassword}
    />

    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
    >
      <Ionicons
        name={showPassword ? "eye-off-outline" : "eye-outline"}
        size={22}
        color="#555"
      />
    </TouchableOpacity>
  </View>
) : (
  <Text style={styles.value}>********</Text>
)}

          {/* Tombol */}
          {editMode ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Simpan Perubahan</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setEditMode(true)}
            >
              <Text style={styles.buttonText}>Edit Data</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <CustomerBottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F4F6F8" },

  header: {
    paddingVertical: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#2563EB",
  },

  label: {
    color: "#555",
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },

  value: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  editButton: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  saveButton: {
    backgroundColor: "#16A34A",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },

  logoutButton: {
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  passwordContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  paddingHorizontal: 10,
  marginBottom: 10,
  backgroundColor: "#fff",
},

passwordInput: {
  flex: 1,
  paddingVertical: 10,
},
});