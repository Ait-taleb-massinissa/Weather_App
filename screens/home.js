import React, { useEffect, useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
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
  // Clé API pour accéder aux données météo
  const WEATHER_API_KEY = "5f7f2be2f23a4bd395c185814241407";

  // États pour gérer les données et l'état de l'application
  const [location, setLocation] = useState(null); // Stocke la position GPS
  const [errorMsg, setErrorMsg] = useState(null); // Stocke les messages d'erreur
  const [data, setData] = useState(null); // Stocke les données météo
  const [minmax, setMinMax] = useState({}); // Stocke les températures minimales et maximales
  const [bgColors, setBgColors] = useState(); // Couleurs de fond (non utilisé ici)
  const [suggestions, setSuggestions] = useState([]); // Suggestions pour la recherche de villes

  const [favorites, setFavorites] = useState(); // Liste des villes favorites
  const [gpsData, setGpsData] = useState(null); // Données météo pour la position GPS

  // Effet pour récupérer la position GPS et les données météo au démarrage
  useEffect(() => {
    getGps();

    if (location) {
      // Recherche des données météo pour la position GPS
      search(location.coords.latitude + "," + location.coords.longitude, true);
    }

    if (favorites) {
      // Recherche des données météo pour les villes favorites
      favorites.map((city) => {
        search(city);
      });
    }
  }, [!location]);

  // Fonction pour obtenir des suggestions de villes en fonction de la recherche
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
          // Formate les suggestions pour l'affichage
          const formattedSuggestions = data.map((item) => ({
            name: item.name,
            state: item.state || "",
            country: item.country,
          }));

          setSuggestions(formattedSuggestions);
        });
    }
    if (query.length == 0) {
      setSuggestions([]); // Réinitialise les suggestions si la recherche est vide
    }
  }

  // Gère le clic sur une suggestion de ville
  const handleSuggestionClick = (city) => {
    setSuggestions(null);
    setWhere(null);
    setBackButton(false);
    goToWeather(city); // Navigue vers l'écran météo pour la ville sélectionnée
  };

  // Fonction pour rechercher les données météo pour une ville
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
          setGpsData(data); // Stocke les données GPS
        } else {
          setData((prevData) => ({ ...prevData, [city]: data })); // Ajoute les données pour la ville
        }
        // Met à jour les températures minimales et maximales
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

  // Fonction pour récupérer les villes favorites depuis le stockage local
  async function getFav() {
    await AsyncStorage.getItem("fav").then((value) => {
      if (value) {
        setFavorites(JSON.parse(value));
        setData({});
        JSON.parse(value).map((city) => {
          search(city); // Recherche les données météo pour chaque ville favorite
        });
      }
    });
  }

  // Effet pour mettre à jour les favoris lorsque l'écran est affiché
  useEffect(() => {
    const unsubscribe = navigation.addListener("didFocus", () => {
      getFav();
    });

    return () => unsubscribe.remove();
  }, [navigation, data]);

  // Fonction pour obtenir la position GPS de l'utilisateur
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

  // Navigue vers l'écran météo pour une ville donnée
  const goToWeather = (where) => {
    navigation.navigate("Weather", { where: where });
  };

  // Navigue vers l'écran météo pour la position GPS
  const goToWeatherGps = () => {
    navigation.navigate("Weather");
  };

  // Navigue vers l'écran de la carte
  const goToWeatherMap = (mode) => {
    navigation.navigate("Map", {
      map: mode,
      pos: [location.coords.latitude, location.coords.longitude],
      where: where,
    });
  };

  // États pour gérer la recherche et l'affichage
  const [where, setWhere] = useState(""); // Ville recherchée
  const [backButton, setBackButton] = useState(false); // Affichage du bouton "retour"

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
      {/* Titre et barre de recherche */}
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
                getSugg(text); // Met à jour les suggestions
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

          {/* Bouton retour */}
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

      {/* Affichage des suggestions */}
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

      {/* Affichage des cartes météo */}
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
