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
  const [bgColors, setBgColors] = useState();
  const [suggestions, setSuggestions] = useState([]);

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

  async function getSugg(query) {
    if (query.length > 0) {
      const url =
        "http://api.openweathermap.org/geo/1.0/direct?q=" +
        query +
        "&limit=5&appid=fe21e9a36b2135cc1f7adb54f65908b9";

      await fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const formattedSuggestions = data.map((item) => ({
            name: item.name,
            state: item.state || "",
            country: item.country,
          }));

          setSuggestions(formattedSuggestions);
          console.log(formattedSuggestions);
        });
    }
    if (query.length == 0) {
      setSuggestions([]);
    }
  }

  const handleSuggestionClick = (city) => {
    setSuggestions(null);
    setWhere(null);
    setBackButton(false);
    goToWeather(city);
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
      where: where,
    });
  };

  const [where, setWhere] = useState("");
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
        marginTop: 50,
      }}
    >
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
              onChangeText={(text) => {
                setWhere(text);
                getSugg(text);
              }}
              onSubmitEditing={() => {
                goToWeather(where), setBackButton(), setSuggestions([]);
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
              setSuggestions([]);
            }}
          >
            <Text style={{ color: "white" }}>back</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          backgroundColor: "#000000DF",
          width: "100%",
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          position: "absolute",
          top: 100,
          zIndex: 10,
        }}
      >
        {suggestions &&
          suggestions.map((city) => (
            <TouchableOpacity
              key={city + Math.random()}
              onPress={() =>
                city.state
                  ? handleSuggestionClick(city.state)
                  : handleSuggestionClick(city.name)
              }
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#FFFFFF1F",
              }}
            >
              <Text style={{ color: "white" }}>
                {city.name}, {city.state}, {city.country}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
      <ScrollView
        style={{ width: "100%", margin: 0 }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {gpsData && minmax["gps"] && (
          <TouchableOpacity
            key="gps"
            onPress={goToWeatherGps}
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
              color={gpsData.current.condition.code}
              gps={true}
            />
          </TouchableOpacity>
        )}

        {data &&
          Object.entries(data)
            .sort()
            .map(([city, weatherData]) => (
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
                  color={weatherData.current.condition.code}
                  gps={false}
                />
              </TouchableOpacity>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default home;
