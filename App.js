import WeatherPage from "./screens/weatherPage";
import Navigator from "./routes/homeStack";
import { StatusBar } from "react-native";
export default function App() {
  return (
    <>
      <StatusBar
        barStyle="dark-content" // makes the status bar text/icons white
        backgroundColor="black" // Android background color for status bar
        translucent={false} // or true, depending on your layout needs
      />
      <Navigator />
    </>
  );
}
