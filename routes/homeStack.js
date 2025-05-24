import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Weather from "../screens/weatherPage";
import Home from "../screens/home";
import Map from "../screens/weathermap";

const screens = {
  Home: {
    screen: Home,
    navigationOptions: {
      headerShown: false,
    },
  },
  Weather: {
    screen: Weather,
    navigationOptions: {
      headerShown: false,
    },
  },
  Map: {
    screen: Map,
    navigationOptions: {
      headerShown: false,
    },
  },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);
