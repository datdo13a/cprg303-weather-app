import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Footer() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    setMenuVisible(false);
    router.push(path);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/")}
            >
              <Ionicons name="home" size={24} color="#fff" />
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/cities")}
            >
              <Ionicons name="list" size={24} color="#fff" />
              <Text style={styles.menuText}>Cities</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/search")}
            >
              <Ionicons name="search" size={24} color="#fff" />
              <Text style={styles.menuText}>Search</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.closeButton]}
              onPress={() => setMenuVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
              <Text style={styles.menuText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  menuContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 20,
    padding: 20,
    minWidth: 250,
    marginBottom: 100,
    marginRight: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  closeButton: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  menuText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
});
