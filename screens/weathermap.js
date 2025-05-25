import MapView, { UrlTile, Marker } from "react-native-maps";
// Importation des composants et bibliothèques nécessaires
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { use, useEffect } from "react";
import { useState } from "react";
import BackButton from "../Components/backBtn";
import DropDown from "../Components/dropDown";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef } from "react";
import TemperatureLegend from "../Components/TempLegend";

export default function WeatherMap({ navigation }) {
  // Clé API pour OpenWeatherMap
  const API_KEY = "fe21e9a36b2135cc1f7adb54f65908b9";

  // État pour gérer la couche météo sélectionnée
  const [weatherLayer, setWeatherLayer] = useState(navigation.getParam("map"));
  // Position transmise via les paramètres de navigation
  const position = navigation.getParam("pos");

  // Options pour le menu déroulant permettant de sélectionner les couches météo
  const options = [
    { name: "temperature", value: "temp_new", icon: "thermometer" },
    { name: "clouds", value: "clouds_new", icon: "weather-cloudy" },
    { name: "wind", value: "wind_new", icon: "weather-windy" },
    {
      name: "precipitation",
      value: "precipitation_new",
      icon: "weather-rainy",
    },
  ];

  // Référence au composant MapView
  const mapRef = useRef(null);

  // Fonction pour réinitialiser la position de la carte à la position initiale
  const resetLocation = () => {
    mapRef.current.animateToRegion(
      {
        latitude: position[0],
        longitude: position[1],
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      },
      1000
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête avec bouton retour et menu déroulant */}
      <View
        style={{
          zIndex: 10,
          position: "absolute",
          top: 35,
          left: 5,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
        <DropDown
          options={options}
          onSelect={(option) => setWeatherLayer(option.value)}
        />
      </View>
      {/* Bouton pour réinitialiser la position de la carte */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 85,
          right: 5,
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.17)",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          margin: 10,
        }}
        onPress={resetLocation}
      >
        <MaterialIcons name="gps-fixed" size={24} color="white" />
      </TouchableOpacity>
      {/* MapView affichant les couches météo */}
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={lightMapStyle}
        initialRegion={{
          latitude: position[0],
          longitude: position[1],
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
      >
        {/* Tuiles de la couche météo */}
        <UrlTile
          urlTemplate={
            "https://tile.openweathermap.org/map/" +
            weatherLayer +
            "/{z}/{x}/{y}.png?appid=" +
            API_KEY
          }
          maximumZ={19}
          flipY={false}
        />
        {/* Marqueur pour la position initiale */}
        <Marker
          coordinate={{
            latitude: position[0],
            longitude: position[1],
          }}
        />
      </MapView>
      {/* Affiche la légende de température si la couche température est sélectionnée */}
      {weatherLayer === "temp_new" && <TemperatureLegend />}
    </SafeAreaView>
  );
}

// Styles pour le conteneur et la carte
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

// Style personnalisé pour une carte en thème clair
const lightMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#ebe3cd" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#523735" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#c9b2a6" }],
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#f5f1e6" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#f8c967" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#b9d3c2" }],
  },
];
