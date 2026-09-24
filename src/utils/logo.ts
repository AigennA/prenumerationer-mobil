import { ImageSourcePropType } from "react-native";

import { getFileUrl } from "@/services/prenumerationApi";

const KNOWN_LOGOS: Record<string, ImageSourcePropType> = {
  netflix: require("@/assets/images/logos/netflix.png"),
  spotify: require("@/assets/images/logos/spotify.png"),
  viaplay: require("@/assets/images/logos/viaplay.png"),
};

export function getLogo(serviceName: string, logoUrl: string | null): ImageSourcePropType | null {
  if (logoUrl) return { uri: getFileUrl(logoUrl) };
  return KNOWN_LOGOS[serviceName.trim().toLowerCase()] ?? null;
}
