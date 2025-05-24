import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const TempScaleWithGradient = () => {
  const values = [40, 20, 0, -10, -20];
  const colors = ["#ff4500", "#ffa500", "#ffff00", "#00bfff", "#1e90ff"];

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={colors}
        style={styles.gradientBar}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.scale}>
        {values.map((val, index) => (
          <Text key={index} style={styles.value}>
            {val}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 200,
    paddingVertical: 10,
    backgroundColor: "rgba(30, 30, 30, 0.32)",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
top: 100,
left: 15,},
  scale: {
    justifyContent: "space-between",
    height: "100%",
  },
  value: {
    marginLeft: 10,
    marginRight: 0,
    fontSize: 14,
    color: "white",
  },
  gradientBar: {
    width: 10,
    height: "100%",
    borderRadius: 8,
  },
});

export default TempScaleWithGradient;
