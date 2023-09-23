import React from 'react';
import axios from 'axios';

import HomeScreen from './screens/Home'
import LoginScreen from './screens/Login'
import RegisterScreen from './screens/Register'
import ChatScreen from './screens/Chatroom'
import WelcomeScreen from './screens/Welcome'
import CreateChat from './screens/CreateChat';

axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="CreateChat" component={CreateChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;