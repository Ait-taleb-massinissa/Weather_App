import MapView, { UrlTile } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export default function WeatherMap({ navigation }) {
  const API_KEY = "fe21e9a36b2135cc1f7adb54f65908b9";
  const weatherLayer = navigation.getParam("map");
  const position = navigation.getParam("pos");
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: position[0],
          longitude: position[1],
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
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
      </MapView>
    </View>
  );
}

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
