import { SHADOW_STYLE } from "@/utils/colors";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="white" />
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 30,
  },
  message: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  actionButton: {
    marginTop: 24,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    ...SHADOW_STYLE,
  },
  actionLabel: {
    color: "#c6c6c6ff",
    fontSize: 16,
    fontWeight: "600",
  },
});
