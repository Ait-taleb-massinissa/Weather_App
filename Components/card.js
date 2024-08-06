import React from "react";
import { Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

function card() {
  return (
    <View
      style={{
        width: 350,
        height: 150,
        backgroundColor: "white",
        borderRadius: 25,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: 700, margin: 20 }}>
        My position
      </Text>
      <Text style={{marginLeft:20,marginTop:-15}}>
        Tizi-Ouzou
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
        27°
      </Text>
      <Text
        style={{ position: "absolute", bottom: 0, fontSize: 18, margin: 20 }}
      >
        Clear
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
            <Text>21°</Text>
            </View>
            <View
            style={{
                flexDirection: "row",
                alignItems:"center"
            }}
            >
            <AntDesign name="arrowup" size={24} color="black" />
            <Text>38°</Text>
            </View>
        </View>
    </View>
  );
}

export default card;
