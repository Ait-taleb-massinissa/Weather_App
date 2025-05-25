// Importation des modules nécessaires
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

// Définition du composant `MiniMap`
const MiniMap = (props) => {
  // Extraction des coordonnées et autres props
  const { lat, lon } = props;

  // Clé API pour accéder aux tuiles météo
  const API_KEY = "fe21e9a36b2135cc1f7adb54f65908b9";

  // Type de couche météo à afficher
  const weatherLayer = "temp_new";

  // Rendu du composant
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat, // Latitude initiale
          longitude: lon, // Longitude initiale
          latitudeDelta: 0.05, // Zoom sur la latitude
          longitudeDelta: 0.05, // Zoom sur la longitude
        }}
        pointerEvents="none" // Désactive les interactions utilisateur
      >
        {/* Affichage des tuiles météo */}
        <UrlTile
          urlTemplate={
            "https://tile.openweathermap.org/map/" +
            weatherLayer +
            "/{z}/{x}/{y}.png?appid=" +
            API_KEY
          }
          maximumZ={19} // Niveau de zoom maximum
          flipY={false} // Ne retourne pas les tuiles verticalement
        />
        {/* Marqueur pour indiquer la position */}
        <Marker
          coordinate={{
            latitude: lat,
            longitude: lon,
          }}
        />
      </MapView>
    </View>
  );
};

// Styles pour le composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200, // Hauteur de la carte
    width: "100%", // Largeur de la carte
    overflow: "hidden", // Cache les débordements
    borderRadius: 10, // Bords arrondis
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Remplit tout l'espace disponible
  },
});

export default MiniMap;
