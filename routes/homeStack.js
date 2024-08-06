import {createStackNavigator} from "react-navigation-stack";
import {createAppContainer} from "react-navigation";
import Weather from "../screens/weatherPage";
import Home from "../screens/home";

const screens = {
    Home:{
        screen:Home
    },
    Weather:{
        screen:Weather
    }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);