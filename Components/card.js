import React from "react";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

function card( props) {

  return (
    <LinearGradient
      style={{
        width: 350,
        height: 150,
        borderRadius: 25,
      }}
 
      colors={props.color}
    >
      
      <Text style={{ fontSize: 20, fontWeight: 700, margin: 20 }}>
        My position
      </Text>
      <Text style={{marginLeft:20,marginTop:-15}}>
        {props.city}
      </Text>
      <Text
        style={{
          position: "absolute",
          right: 0,
          fontSize: 55,
          fontWeight: 600,
          margin: 10,
        }}
      >
        {props.temp}°
      </Text>
      <Text
        style={{ position: "absolute", bottom: 0, fontSize: 18, margin: 20 }}
      >
        {props.condition}
      </Text>
      
        <View 
        style={{flexDirection:"row",position:"absolute",right:0,bottom:0, margin: 20}}
        >
            <View
            style={{
                flexDirection: "row",
                alignItems:"center"
            }}
            >
            <AntDesign name="arrowdown" size={24} color="black" />
            <Text>{props.min}°</Text>
            </View>
            <View
            style={{
                flexDirection: "row",
                alignItems:"center"
            }}
            >
            <AntDesign name="arrowup" size={24} color="black" />
            <Text>{props.max}°</Text>
            </View>
        </View>
    </LinearGradient>
  );
}

export default card;
