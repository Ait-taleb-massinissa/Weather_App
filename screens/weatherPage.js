import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import moment from "moment";
import { AntDesign } from "@expo/vector-icons";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";
import "moment/locale/fr";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  NativeModules,
} from "react-native";
import React from "react";

function weatherPage({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState(null);
  const [showdata, setShowdata] = useState(false);
  const [minmax, setMinMax] = useState();
  const [latLon, setLatLon] = useState();
  const [search, setsearch] = useState("");
  const [language, setLanguage] = useState("");
  const Conditions = require("../assets/condition.json");
  const [bgColors, setBgColors] = useState(["#9EC2FF", "#212AA5"]);

  async function Search(city) {
    setShowdata(false);
    setData(null);
    const currentURL =
      "http://api.weatherapi.com/v1/forecast.json?key=" +
      WEATHER_API_KEY +
      "&q=" +
      city +
      "&days=14&lang=" +
      language.split("_")[0];
    await fetch(currentURL)
      .then((response) => response.json())
      .then((data) => {

        setData(data);
        setShowdata(true);
        Conditions.map((cond) => {
          if (cond.code == data.current.condition.code) {
            setBgColors(cond.gradient);
          }
        });
        data.forecast.forecastday.map((date) => {
          if (date.date == moment().format("YYYY-MM-DD")) {
            setMinMax([date.day.mintemp_c, date.day.maxtemp_c]);
          }
        });
      })
      .catch((error) => {
        console.log("++++++ error ++++++");
        console.log(error);
      });
  }

  useEffect(() => {
    
    const getDeviceLanguage = async () => {
      let deviceLanguage = "en";

      if (Platform.OS === "android") {
        const { I18nManager } = NativeModules;
        deviceLanguage =
          (await I18nManager.getConstants().localeIdentifier) || "en";
      } else if (Platform.OS === "ios") {
        const { Settings } = NativeModules;
        deviceLanguage =
          (await Settings.generalSettings().localeIdentifier) || "en";
      }
      setLanguage(deviceLanguage);
    };

    getDeviceLanguage();
    if (navigation.getParam("where")!=undefined) {
      Search(navigation.getParam("where"));
    } else {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(location)
        setLatLon([location.coords.latitude, location.coords.longitude]);
        Search(location.coords.latitude + "," + location.coords.longitude);
      })();
      
    }
  }, []);
  if (language.startsWith("fr_")) {
    moment.locale("fr");
  } else {
    moment.locale("en");
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.background}>
      <LinearGradient colors={bgColors} style={styles.background} >
        <SafeAreaView style={styles.screen}>
          {showdata && data && (
            <View style={styles.temps}>
              <Text style={{ fontSize: 25 }}>{data.location.region}</Text>

              <Text style={{ fontSize: 100 }}>
                {Math.round(data.current.heatindex_c)}°
              </Text>
              {/* <Image
                source={{ uri: "https:" + data.current.condition.icon }}
                style={{ width: 150, height: 150 }}
              /> */}
              <Text> {data.current.condition.text} </Text>
              {minmax && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 20,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: 100,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="arrowdown" size={24} color="black" />
                      <Text>{Math.round(minmax[0])}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <AntDesign name="arrowup" size={24} color="black" />
                      <Text>{Math.round(minmax[1])}</Text>
                    </View>
                  </View>
                </View>
              )}

              <View
                style={{
                  height: 150,
                  backgroundColor: "rgba(158, 194, 255, 0.3)",
                  borderRadius: 20,
                  width: 350,
                  padding: 20,
                }}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {showdata &&
                    data &&
                    data.forecast.forecastday[0].hour.map((hour, index) => (
                      <>
                        {moment(data.location.localtime).format(
                          "yyyy-MM-DD HH"
                        ) <= moment(hour.time).format("yyyy-MM-DD HH") && (
                          <View
                            key={index}
                            style={{
                              width: 100,
                              height: 100,
                              justifyContent: "center",
                              alignItems: "center",
                              borderRadius: 10,
                              backgroundColor: "rgba(158, 194, 255, 0.5)",
                              marginLeft: 10,
                              padding: 10,
                            }}
                          >
                            <Text>
                              {moment(data.location.localtime).format(
                                "yyyy-MM-DD HH"
                              ) === moment(hour.time).format("yyyy-MM-DD HH")
                                ? language.startsWith("fr")
                                  ? "Maint."
                                  : "Now."
                                : moment(hour.time).format("HH") + "h"}
                            </Text>
                            <Image
                              source={{
                                uri: "https:" + hour.condition.icon,
                              }}
                              style={{ width: 50, height: 50 }}
                            />
                            <Text>{Math.round(hour.temp_c)}°</Text>
                          </View>
                        )}
                      </>
                    ))}
                </ScrollView>
              </View>

              <View
                style={{
                  
                  backgroundColor: "rgba(158, 194, 255, 0.3)",
                  borderRadius: 20,
                  width: 350,
                  padding: 20,
                  marginTop: 20,
                  
                }}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  {showdata &&
                    data &&
                    data.forecast.forecastday.map((day, index) => (
                      <View
                        key={index}
                        style={{
                          height: 30,
                          borderBottomWidth: 1,
                          borderBottomColor: "rgba(250, 250, 250, 0.3)",
                          flexDirection: "row",
                          justifyContent: "space-evenly",
                          padding: 5,
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: 200,
                          }}
                        >
                          <Text>
                            {moment(new Date()).format("yyyy-MM-DD") == day.date
                              ? language.startsWith("fr")
                                ? "Auj."
                                : "Today"
                              : moment(day.date).format("ddd")}
                          </Text>

                          <Image
                            source={{
                              uri: "https:" + day.day.condition.icon,
                            }}
                            style={{ width: 40, height: 40 }}
                          />
                        </View>
                        <Text style={{ color: "lightgrey", fontWeight: 600 }}>
                          {Math.round(day.day.mintemp_c)}°
                        </Text>
                        <Text style={{ fontWeight: 600 }}>
                          {Math.round(day.day.maxtemp_c)}°
                        </Text>
                      </View>
                    ))}
                </ScrollView>
              </View>
            </View>
          )}
          <StatusBar style="auto" />
        </SafeAreaView>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    minHeight:"100%"
  },
  screen: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
    minHeight:690

  },
  temps: {
    alignItems: "center",
    justifyContent: "center",
  },
  nextDays: {},
});

export default weatherPage;
