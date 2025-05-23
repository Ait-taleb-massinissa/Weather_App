import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "@env";
import "moment/locale/fr";
import moment from "moment";
const Conditions = require("../assets/condition.json");
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Search from "../Search";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { ScrollView } from "react-native";

function home({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState(null);
  const [minmax, setMinMax] = useState({});
  const [bgColors, setBgColors] = useState(["#9EC2FF", "#212AA5"]);
  const [suggestions, setSuggestions] = useState([]);
  const [home, setHome] = useState(true);
  const [map, setMap] = useState("");
  const [favorites, setFavorites] = useState();
  const [gpsData, setGpsData] = useState(null);

  useEffect(() => {
    getGps();

    if (location) {
      search(location.coords.latitude + "," + location.coords.longitude, true);
    }

    if (favorites) {
      favorites.map((city) => {
        search(city);
      });
    }
  }, [!location]);

  const handleInputChange = async () => {
    if (where.length < 2) {
      setSuggestions([]);
    } else {
      await fetch(
        "http://api.openweathermap.org/geo/1.0/direct?q=" +
          where +
          "&limit=5&appid=" +
          OPENWEATHER_API_KEY
      )
        .then((response) => response.json)
        .then((data) => {
          setSuggestions(data);
        });
    }
  };

  const handleSuggestionClick = (city) => {
    setWhere(city.name);
    setSuggestions([]);
    search(city.name);
  };

  async function search(city, gps = false) {
    const currentURL =
      "http://api.weatherapi.com/v1/forecast.json?key=" +
      WEATHER_API_KEY +
      "&q=" +
      city;
    await fetch(currentURL)
      .then((response) => response.json())
      .then((data) => {
        if (gps) {
          setGpsData(data);
        } else {
          setData((prevData) => ({ ...prevData, [city]: data }));
        }

        Conditions.map((cond) => {
          if (cond.code == data.current.condition.code) {
            setBgColors(cond.gradient);
          }
        });

        data.forecast.forecastday.map((date) => {
          if (date.date == moment().format("YYYY-MM-DD")) {
            if (gps) {
              setMinMax((prev) => ({
                ...prev,
                gps: [date.day.mintemp_c, date.day.maxtemp_c],
              }));
            } else {
              setMinMax((prev) => ({
                ...prev,
                [city]: [date.day.mintemp_c, date.day.maxtemp_c],
              }));
            }
          }
        });
      });
  }

  async function getFav() {
    await AsyncStorage.getItem("fav").then((value) => {
      if (value) {
        setFavorites(JSON.parse(value));
        setData({});
        JSON.parse(value).map((city) => {
          search(city);
        });
      }
    });
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener("didFocus", () => {
      getFav();
    });

    return () => unsubscribe.remove();
  }, [navigation, data]);

  const getGps = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLatLon([location.coords.latitude, location.coords.longitude]);
  };

  const goToWeather = (where) => {
    navigation.navigate("Weather", { where: where });
  };

  const goToWeatherGps = () => {
    navigation.navigate("Weather");
  };
  const goToWeatherMap = (mode) => {
    navigation.navigate("Map", {
      map: mode,
      pos: [location.coords.latitude, location.coords.longitude],
    });
  };

  const [where, setWhere] = useState();
  const [backButton, setBackButton] = useState(false);

  const styles = {
    input: {
      width: "90%",
      height: 42,
      paddingLeft: 20,
      color: "white",
      fontWeight: "600",
    },
    searchBar: {
      // width: backButton?320:380,
      width: backButton ? "80%" : "100%",
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
      {home && (
        <View style={{ margin: 20 }}>
          <Text style={styles.title}>Weather</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={styles.searchBar}>
              <TextInput
                style={styles.input}
                placeholder="Enter city"
                placeholderTextColor={"#FFFFFF7F"}
                value={where}
                onChangeText={setWhere}
                onChange={handleInputChange}
                onSubmitEditing={() => {
                  goToWeather(where), setBackButton();
                }}
                onPress={() => {
                  setBackButton(true);
                }}
              />
              <MaterialIcons
                name="gps-fixed"
                size={20}
                color="#FFFFFF7F"
                onPress={goToWeatherGps}
              />
            </View>
            {suggestions.length > 0 && (
              <ul>
                {suggestions.map((city, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(city)}>
                    {city.name}, {city.country}
                  </li>
                ))}
              </ul>
            )}

            <TouchableOpacity
              style={{
                display: backButton ? "flex" : "none",
                width: "20%",
                paddingLeft: 20,
              }}
              onPress={() => {
                Keyboard.dismiss();
                setWhere("");
                setBackButton(false);
              }}
            >
              <Text style={{ color: "white" }}>back</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={{ width: "100%", margin: 0 }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {home && gpsData && minmax["gps"] && (
          <TouchableOpacity
            key="gps"
            onPress={() => goToWeather(gpsData.location.region)}
            style={{
              marginVertical: 10,
              width: "90%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Card
              city={gpsData.location.region}
              temp={Math.round(gpsData.current.heatindex_c)}
              condition={gpsData.current.condition.text}
              min={Math.round(minmax["gps"][0])}
              max={Math.round(minmax["gps"][1])}
              color={bgColors}
            />
          </TouchableOpacity>
        )}

        {home &&
          data &&
          Object.entries(data).map(([city, weatherData]) => (
            <TouchableOpacity
              key={city}
              onPress={() => goToWeather(weatherData.location.region)}
              style={{
                marginVertical: 10,
                width: "90%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card
                city={weatherData.location.region}
                temp={Math.round(weatherData.current.heatindex_c)}
                condition={weatherData.current.condition.text}
                min={Math.round(minmax[city]?.[0] || 0)}
                max={Math.round(minmax[city]?.[1] || 0)}
                color={bgColors}
              />
            </TouchableOpacity>
          ))}
      </ScrollView>

      {map && (
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "black",
            alignItems: "center",
            paddingVertical: 40,
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            style={{
              width: 300,
              backgroundColor: "#1f1f1f",
              paddingVertical: 15,
              marginVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333",
            }}
            onPress={() => {
              goToWeatherMap("temp_new");
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Temperature Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 300,
              backgroundColor: "#1f1f1f",
              paddingVertical: 15,
              marginVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333",
            }}
            onPress={() => {
              goToWeatherMap("precipitation_new");
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Precipitation Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 300,
              backgroundColor: "#1f1f1f",
              paddingVertical: 15,
              marginVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333",
            }}
            onPress={() => {
              goToWeatherMap("wind_new");
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Wind Map
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 300,
              backgroundColor: "#1f1f1f",
              paddingVertical: 15,
              marginVertical: 10,
              borderRadius: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333",
            }}
            onPress={() => {
              goToWeatherMap("clouds_new");
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              Clouds Map
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}

      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          bottom: 30,
          alignItems: "center",
          justifyContent: "space-evenly",
          width: "100%",
          marginTop: 20,
          backgroundColor: "#FFFFFF1F",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setHome(true);
            setMap(false);
          }}
          style={{
            width: 150,
            height: 70,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              padding: 0,
            }}
          >
            Home
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setHome(false);
            setMap(true);
          }}
          style={{
            width: 150,
            height: 70,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              padding: 0,
            }}
          >
            Map
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default home;
