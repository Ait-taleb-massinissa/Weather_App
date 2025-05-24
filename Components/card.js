import React, { use } from "react";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
const Conditions = require("../assets/condition.json");
import { useState, useEffect } from "react";
function card(props) {
  const [bgColors, setBgColors] = useState(["#9EC2FF", "#212AA5"]);
  useEffect(() => {
    Conditions.map((cond) => {
      if (cond.code == props.color) {
        setBgColors(cond.gradient);
      }
    });
  }, [props.color]);

  return (
    <LinearGradient
      style={{
        width: 350,
        height: 150,
        borderRadius: 25,
      }}
      colors={bgColors}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: 700,
          margin: 20,
          color: "white",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
        }}
      >
        {props.city}
      </Text>
      {props.gps && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              marginLeft: 20,
              marginTop: -15,
              color: "white",
              fontWeight: 700,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
            }}
          >
            My position
          </Text>
          <AntDesign
            name="enviromento"
            size={15}
            color="white"
            style={{
              marginLeft: 5,
              marginTop: -15,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
            }}
          />
        </View>
      )}
      <Text
        style={{
          position: "absolute",
          right: 0,
          fontSize: 55,
          fontWeight: 600,
          margin: 10,
          color: "white",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
        }}
      >
        {props.temp}°
      </Text>
      <Text
        style={{
          position: "absolute",
          bottom: 0,
          fontSize: 18,
          margin: 20,
          width: 150,
          color: "white",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
        }}
      >
        {props.condition}
      </Text>

      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          right: 0,
          bottom: 0,
          margin: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="arrowdown"
            size={24}
            color="white"
            style={{
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
            }}
          />
          <Text
            style={{
              color: "white",
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
            }}
          >
            {props.min}°
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <AntDesign
            name="arrowup"
            size={24}
            color="white"
            style={{
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
            }}
          />
          <Text
            style={{
              color: "white",
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
            }}
          >
            {props.max}°
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

export default card;
