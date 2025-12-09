// Central color and styling constants for the Weather App

export const COLORS = {
  // Gradients
  PRIMARY_GRADIENT: ["#3D4E81", "#5753C9", "#6E7FF3"],
  GRADIENT_LOCATIONS: [0, 0.48, 1],

  // Text colors
  TEXT_PRIMARY: "#fff",
  TEXT_SECONDARY: "#fff",

  // Overlay colors
  OVERLAY_LIGHT: "rgba(255, 255, 255, 0.2)",
  OVERLAY_MEDIUM: "rgba(255, 255, 255, 0.25)",
  OVERLAY_MEDIUM_LIGHT: "rgba(255, 255, 255, 0.35)",
};

// Standard shadow style for iOS and Android
export const SHADOW_STYLE = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
};

// Light shadow for subtle elevation
export const SHADOW_LIGHT = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4,
};

// No shadow style for disabled states
export const SHADOW_NONE = {
  shadowOpacity: 0,
  elevation: 0,
};
