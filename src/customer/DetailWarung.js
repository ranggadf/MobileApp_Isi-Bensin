import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

export default function DetailWarung() {
  const route = useRoute();
  const navigation = useNavigation();
  const { data } = route.params;

  const [jumlahPertalite, setJumlahPertalite] = useState(0);
  const [jumlahPertamax, setJumlahPertamax] = useState(0);

  return (
    <SafeAreaView edges={["left", "right", "bottom"]} style={styles.container}>
      <ScrollView style={{ flex: 1 }}>

        {/* Foto Warung */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/images/warung.jpeg")}
            style={styles.warungImage}
          />
        </View>

        {/* Info Warung */}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{data.nama}</Text>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color="#fff" />
            <Text style={styles.headerTime}> 30 menit</Text>
          </View>
        </View>

        {/* Deskripsi Warung */}
        <View style={styles.section}>
          <Text style={styles.warungTitle}>{data.nama}</Text>
          <Text style={styles.warungDesc}>
            Sedia bensin pertalite dan pertamax dan siap mengantarkan ke tujuan
          </Text>
        </View>

        {/* Produk */}
        <View style={styles.produk}>
          {/* Pertalite */}
          <View style={styles.item}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.itemImg}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>Bensin Pertalite</Text>
              <Text style={styles.itemHarga}>Rp 5.000</Text>

              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => setJumlahPertalite(Math.max(0, jumlahPertalite - 1))}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.counterText}>{jumlahPertalite} ltr</Text>

                <TouchableOpacity
                  onPress={() => setJumlahPertalite(jumlahPertalite + 1)}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="cart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Pertamax */}
          <View style={styles.item}>
            <Image
              source={{ uri: "https://via.placeholder.com/100" }}
              style={styles.itemImg}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle}>Bensin Pertamax</Text>
              <Text style={styles.itemHarga}>Rp 5.000</Text>

              <View style={styles.counter}>
                <TouchableOpacity
                  onPress={() => setJumlahPertamax(Math.max(0, jumlahPertamax - 1))}
                >
                  <Ionicons name="remove-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.counterText}>{jumlahPertamax} ltr</Text>

                <TouchableOpacity
                  onPress={() => setJumlahPertamax(jumlahPertamax + 1)}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.addBtn}>
              <Ionicons name="cart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
     <View style={styles.bottomNav}>
       <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("DashboardCustomer")}>
         <Ionicons name="home-outline" size={24} color="#fff" />
       </TouchableOpacity>
     
       <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("KeranjangScreen")}>
         <Ionicons name="cart-outline" size={24} color="#fff" />
       </TouchableOpacity>
     
       <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("PesananScreen")}>
         <Ionicons name="chatbubble-outline" size={24} color="#fff" />
       </TouchableOpacity>
     
       <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("RiwayatScreen")}>
         <Ionicons name="time-outline" size={24} color="#fff" />
       </TouchableOpacity>
     </View>
     
     
     
    </SafeAreaView>
  );
}

// ... SAME IMPORTS AND LOGIC

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1520",
  },

  imageWrapper: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  warungImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  headerInfo: {
    padding: 15,
  },

  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  headerTime: {
    color: "#FFD369",
    fontSize: 14,
  },

  section: {
    padding: 15,
  },

  warungTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },

  warungDesc: {
    color: "#A9A9A9",
    marginTop: 6,
    lineHeight: 20,
  },

  produk: {
    paddingHorizontal: 15,
    marginTop: 10,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C2532",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2D3645",
  },

  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },

  itemInfo: {
    flex: 1,
  },

  itemTitle: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  itemHarga: {
    color: "#738cb0",
    marginTop: 4,
    fontWeight: "700",
  },

  counter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#2D3645",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  counterText: {
    color: "#fff",
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: "700",
  },

  addBtn: {
    backgroundColor: "#838bbe",
    padding: 8,
    borderRadius: 8,
  },

  bottomNav: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#161C27",
    borderTopWidth: 1,
    borderTopColor: "#2D3645",
  },
});
