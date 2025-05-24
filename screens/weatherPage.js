import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { use, useEffect, useState } from "react";
import moment from "moment";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";
import "moment/locale/fr";
import {
  Alert,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import MiniMap from "../Components/miniMap";
import BackButton from "../Components/backBtn";

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
  const [fav, setFav] = useState([]);
  const [gps, setGps] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [showRemove, setShowRemove] = useState(false);

  useEffect(() => {
    async function getData(key) {
      try {
        const value = await AsyncStorage.getItem(key).then((value) => {
          if (value != null) {
            const parsedValue = JSON.parse(value);
            setFav(parsedValue);
          } else {
            console.log("No data found");
          }
        });
      } catch (error) {
        console.log("Error retrieving data: ", error);
      }
    }
    getData("fav");
  }, [fav]);

  async function removeData(key, value) {
    try {
      const old = await AsyncStorage.getItem(key);
      if (old != null) {
        const oldData = JSON.parse(old);
        const newData = oldData.filter((item) => item !== value);
        await AsyncStorage.setItem(key, JSON.stringify(newData));
        console.log("Data removed: ", newData);
      }
    } catch (error) {
      console.log("Error removing data: ", error);
    }
  }
  async function storeData(key, value) {
    try {
      const old = await AsyncStorage.getItem(key);
      if (old == null) {
        await AsyncStorage.setItem(key, JSON.stringify([value]));
      } else {
        if (!old.includes(value)) {
          const oldData = JSON.parse(old);
          const newData = [...oldData, value];
          await AsyncStorage.setItem(key, JSON.stringify(newData));
          console.log("Data stored: ", newData);
        } else {
          console.log("Already in favorites");
        }
      }
    } catch (error) {
      console.log("Error storing data: ", error);
    }
  }

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
    if (data && fav) {
      if (gps == false) {
        setShowFav(!fav.includes(data.location.name));
        setShowRemove(fav.includes(data.location.name));
      }
    }
  }, [data, fav, gps]);

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
    if (navigation.getParam("where") != undefined) {
      Search(navigation.getParam("where"));
      setGps(false);
    } else {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        setLatLon([location.coords.latitude, location.coords.longitude]);
        Search(location.coords.latitude + "," + location.coords.longitude);
      })();
      setGps(true);
    }
  }, []);
  if (language.startsWith("fr_")) {
    moment.locale("fr");
  } else {
    moment.locale("en");
  }

  const showAlert = () => {
    Alert.alert(
      "Are you sure?",
      "do you want to remove this location from your favorites?",
      [
        {
          text: "Yes",
          onPress: () => {
            removeData("fav", data.location.name);
            setShowFav(true);
            setShowRemove(false);
            alert("Removed from favorites");
          },
        },
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const goToWeatherMap = () => {
    navigation.navigate("Map", {
      pos: [data.location.lat, data.location.lon],
      map: "temp_new",
    });
  };

  return (
    <SafeAreaView style={styles.background}>
      <LinearGradient colors={bgColors}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView style={styles.screen}>
            <View
              style={{
                position: "absolute",
                top: -90,
                left: 5,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "95%",
              }}
            >
              <BackButton
                onPress={() => {
                  navigation.goBack();
                }}
              />
              {showRemove && (
                <TouchableOpacity
                  onPress={() => {
                    console.log("remove");
                    showAlert();
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: 700,

                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                    }}
                  >
                    remove
                  </Text>
                </TouchableOpacity>
              )}

              {showFav && (
                <TouchableOpacity
                  onPress={() => {
                    console.log("add");
                    storeData("fav", data.location.name);
                    setShowFav(false);
                    setShowRemove(true);
                    Alert.alert("Added to favorites");
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontWeight: 700,

                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.3,
                    }}
                  >
                    Add
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {showdata && data && (
              <View style={styles.temps}>
                <Text
                  style={{
                    fontSize: 25,
                    color: "white",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                  }}
                >
                  {data.location.region}
                </Text>

                <Text
                  style={{
                    fontSize: 90,
                    color: "white",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                    justifyContent: "center",
                    alignContent: "center",
                    paddingLeft: 30,
                    textAlign: "center",
                  }}
                >
                  {Math.round(data.current.heatindex_c)}°
                </Text>

                {/* <Image
                source={{ uri: "https:" + data.current.condition.icon }}
                style={{ width: 150, height: 150 }}
              /> */}
                <Text
                  style={{
                    color: "white",
                    shadowColor: "black",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.3,
                  }}
                >
                  {" "}
                  {data.current.condition.text}{" "}
                </Text>
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
                        color: "white",
                        shadowColor: "black",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.3,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AntDesign
                          name="arrowdown"
                          size={24}
                          color="white"
                          style={{
                            color: "white",
                            shadowColor: "black",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                          }}
                        />
                        <Text
                          style={{
                            color: "white",
                            shadowColor: "black",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                          }}
                        >
                          {Math.round(minmax[0])}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AntDesign
                          name="arrowup"
                          size={24}
                          color="white"
                          style={{
                            color: "white",
                            shadowColor: "black",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                          }}
                        />
                        <Text
                          style={{
                            color: "white",
                            shadowColor: "black",
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.3,
                          }}
                        >
                          {Math.round(minmax[1])}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <View
                  style={{
                    height: 160,
                    backgroundColor: "rgba(158, 194, 255, 0.3)",
                    borderRadius: 20,
                    width: 350,
                    padding: 20,
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      top: -10,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="clock"
                      size={20}
                      color={"rgba(70, 93, 124, 0.48)"}
                    />
                    <Text
                      style={{
                        color: "rgba(70, 93, 124, 0.48)",
                        fontWeight: 600,
                      }}
                    >
                      Next hour prevision
                    </Text>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {showdata &&
                      data &&
                      data.forecast.forecastday[0].hour.map((hour) => {
                        const hourMoment = moment(hour.time);
                        const isFuture = moment(
                          data.location.localtime
                        ).isSameOrBefore(hourMoment);

                        return isFuture ? (
                          <View
                            key={hour.time}
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
                            <Text
                              style={{
                                fontWeight: 600,
                                color: "white",
                                shadowColor: "black",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.3,
                              }}
                            >
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
                            <Text
                              style={{
                                fontWeight: 600,
                                color: "white",
                                shadowColor: "black",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.3,
                              }}
                            >
                              {Math.round(hour.temp_c)}°
                            </Text>
                          </View>
                        ) : null;
                      })}
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
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      top: -10,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calendar-range"
                      size={20}
                      color={"rgba(70, 93, 124, 0.48)"}
                    />
                    <Text
                      style={{
                        color: "rgba(70, 93, 124, 0.48)",
                        fontWeight: 600,
                      }}
                    >
                      Next days prevision
                    </Text>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {showdata &&
                      data &&
                      data.forecast.forecastday.map((day) => (
                        <View
                          key={day.date}
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
                            <Text
                              style={{
                                color: "white",
                                fontWeight: 600,
                                shadowColor: "black",
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.3,
                              }}
                            >
                              {moment(new Date()).format("yyyy-MM-DD") ==
                              day.date
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
                          <Text
                            style={{
                              color: "rgba(250, 250, 250, 0.74)",
                              fontWeight: 600,
                              shadowColor: "black",
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.3,
                            }}
                          >
                            {Math.round(day.day.mintemp_c)}°
                          </Text>
                          <Text
                            style={{
                              fontWeight: 600,
                              color: "white",
                              shadowColor: "black",
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: 0.3,
                            }}
                          >
                            {Math.round(day.day.maxtemp_c)}°
                          </Text>
                        </View>
                      ))}
                  </ScrollView>
                </View>
              </View>
            )}
            {data && (
              <View
                style={{
                  backgroundColor: "rgba(158, 194, 255, 0.3)",
                  borderRadius: 20,
                  width: 350,

                  marginTop: 20,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    top: 10,
                    left: 20,
                  }}
                >
                  <MaterialCommunityIcons
                    name="map"
                    size={20}
                    color={"rgba(70, 93, 124, 0.48)"}
                  />
                  <Text
                    style={{
                      color: "rgba(70, 93, 124, 0.48)",
                      fontWeight: 600,
                    }}
                  >
                    Temperature map
                  </Text>
                </View>

                <TouchableOpacity
                  style={{
                    borderRadius: 20,
                    width: "100%",
                    padding: 20,
                  }}
                  onPress={goToWeatherMap}
                >
                  <MiniMap lat={data.location.lat} lon={data.location.lon} />
                </TouchableOpacity>
              </View>
            )}
          </SafeAreaView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    marginTop: 100,
    minHeight: 690,
    color: "white",
  },
  temps: {
    alignItems: "center",
    justifyContent: "center",
  },
  nextDays: {},
});

export default weatherPage;
