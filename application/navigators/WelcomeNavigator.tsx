import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from '@expo/vector-icons';

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScren";

const BottomTab = createBottomTabNavigator();

function WelcomeNavigator() {
    return (
        <NavigationContainer>
            <BottomTab.Navigator>
                <BottomTab.Screen name="Login" component={LoginScreen} options={{
                    tabBarIcon: ({ color, size }) => < AntDesign name="login" size={size} color={color} />
                }} />
                <BottomTab.Screen name="Register" component={RegisterScreen} options={{
                    tabBarIcon: ({ color, size }) => < AntDesign name="user" size={size} color={color} />
                }} />
            </BottomTab.Navigator>
        </NavigationContainer>
    )
}

export default WelcomeNavigator;