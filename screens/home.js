import React, { useState } from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Button,
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Card from "../Components/card";
import Search from "../Search";

function home({ navigation }) {
  const goToWeather = (where) => {
    navigation.navigate("Weather", { where: where });
  };
  const goToWeatherGps = () => {
    navigation.navigate("Weather");
  };
  const [where, setWhere] = useState();
  const [backButton, setBackButton] = useState(false);

  const styles = {
    input: {
      width:"90%",
      height: 42,
      paddingLeft: 20,
      color: "white",
      fontWeight: "600",
    },
    searchBar: {
      // width: backButton?320:380,
      width: backButton?"80%":"100%",
      flexDirection: "row", 
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF1F",
      borderRadius: 11,
    },
    title: { color: "white", fontWeight: "800", fontSize: 40 },
  };
  
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
        alignItems: "center",
      }}
    >
      <View style={{margin:20}}>
        <Text style={styles.title}>Weather</Text>
        <View style={{ flexDirection: "row", alignItems: "center" ,justifyContent:"space-between"}}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.input}
              placeholder="Enter city"
              placeholderTextColor={"#FFFFFF7F"}
              value={where}
              onChangeText={setWhere}
              onSubmitEditing={() => {goToWeather(where),setBackButton()}}
              onPress={()=>{
                setBackButton(true)
              }}
            />
            <MaterialIcons name="gps-fixed" size={20} color="#FFFFFF7F" onPress={goToWeatherGps} />
          </View>
          <TouchableOpacity
            style={{ display: backButton?"flex":"none",width:"20%",paddingLeft:20 }}
            onPress={() => {
              Keyboard.dismiss();
              setWhere("");
              setBackButton(false)
            }}
          >
            <Text style={{ color: "white" }}>back</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Card/>
    </SafeAreaView>
  );
}


export default home;
