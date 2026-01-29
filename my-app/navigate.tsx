import Registartion from "./components/authentication/registration";
import Login from "./components/authentication/login";
import Menu from "./components/menu/menu";
import CallScreen from "./components/menu/call";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function Navigate() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Registration"
          component={Registartion}
          options={{ title: "Registration" }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ title: "Menu" }}
        />
         <Stack.Screen
          name="Call"
          component={CallScreen}
          options={{ title: "Call" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
