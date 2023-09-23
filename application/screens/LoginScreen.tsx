
import React, { useState } from 'react';
import axios from 'axios';

import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: 40,
    width: '50%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

function LoginScreen({ navigation }: Props) {
  const [server, setServer] = useState('');
  const [name, onChangeName] = useState('');
  const [password, onChangePassword] = useState('');

  const handleLogin = async () => {
    try {
      // Create a data object with the user-provided data
      const user = {
        name: name,
        password: password,
      };

      // Send a POST request to the register endpoint with the data
      axios.defaults.baseURL = `http://${server}:3000/`
      const { data } = await axios.post('/login', user);
      console.log('Response:', data);
      console.info('Store Session:', data.session);
      await AsyncStorage.setItem("user", data.session);
      await AsyncStorage.setItem("server", server);
      navigation.navigate('Home');
      
    } catch (e) {
      console.error('Error:', e);
      Alert.alert('Login failed!', 'Please try again later!');
    }
  };


  return (
    <View style={styles.view}>
      <Text>Login</Text>

      <TextInput
        style={styles.input}
        onChangeText={setServer}
        value={server}
        placeholder="Server"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={name}
        placeholder="Name"
        autoComplete="username"
      />

      <TextInput
        style={styles.input}
        onChangeText={onChangePassword}
        textContentType="password"
        value={password}
        placeholder="Password"
        autoComplete="password"
        secureTextEntry={true}
      />

      <Button
        title="Login"
        onPress={handleLogin}
      />
    </View>
  );
}

export default LoginScreen;