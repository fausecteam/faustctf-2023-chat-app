
import { useContext, useEffect } from "react";
import { AuthContext } from "../stores/AuthContext";
import WelcomeNavigator from "./WelcomeNavigator";
import AppNavigator from "./AppNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";

function ProtectionNavigator() {

    const { isAuthenticated, login } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            const authToken = await AsyncStorage.getItem("token");
            if (authToken) {
                login(authToken);
            }
        })();
    }, []);

    console.log();
    return (!isAuthenticated)
        ? <WelcomeNavigator />
        : <AppNavigator />;
}

export default ProtectionNavigator;