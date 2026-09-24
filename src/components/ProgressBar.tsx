import { StyleSheet, View } from "react-native";

import { colors } from "@/constants/colors";

type Props = {
  percent: number;
  height?: number;
};

export default function ProgressBar({ percent, height = 14 }: Props) {
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${percent}%`, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.accent,
  },
});
