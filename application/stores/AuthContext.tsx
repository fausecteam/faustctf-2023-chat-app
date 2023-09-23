import { createContext, ReactNode, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserContextType {
    authToken: string | null;
    isAuthenticated: boolean;
    login: ((authToken: string) => void);
    logout: (() => void);
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<UserContextType>({
    authToken: null,
    isAuthenticated: false,
    login: (authToken) => { },
    logout: () => { }
});

function AuthProvider({ children }: AuthProviderProps) {

    const [authToken, setAuthToken] = useState<UserContextType['authToken']>(null);

    const login: UserContextType['login'] = (authToken: string) => {
        setAuthToken(authToken);
        AsyncStorage.setItem("token", authToken);
    }

    const logout: UserContextType['logout'] = () => {
        setAuthToken(null);
        AsyncStorage.removeItem("token");
    }

    const value: UserContextType = {
        authToken,
        isAuthenticated: !!authToken,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;