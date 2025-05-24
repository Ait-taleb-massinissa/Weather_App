import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";

const MiniMap = (props) => {
  const { lat, lon } = props;
  const API_KEY = "fe21e9a36b2135cc1f7adb54f65908b9";
  const weatherLayer = "temp_new";
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        pointerEvents="none"
      >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    width: "100%",
    overflow: "hidden",
    borderRadius: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MiniMap;
