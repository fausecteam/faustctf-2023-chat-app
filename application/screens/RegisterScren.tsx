import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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

function RegisterScreen({ navigation }: Props) {

  const [server, setServer] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleRegisterPress = async () => {
    // Create a data object with the user-provided data
    const user = {
      name: name,
      password: password,
    };

    try {
      // Send a POST request to the register endpoint with the data
      axios.defaults.baseURL = `http://${server}:3000/`
      console.log(axios.defaults.baseURL);
      const { data } = await axios.post('/register', user);
      console.log('Response:', data);
      console.info('Store Session:', data.session);
      await AsyncStorage.setItem("user", data.session);
      await AsyncStorage.setItem("server", server);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <View style={styles.view}>
      <Text>Register</Text>

      <TextInput
        style={styles.input}
        onChangeText={setServer}
        value={server}
        placeholder="Server"
      />

      <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="Name"
        autoComplete="username"
      />

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        textContentType="password"
        value={password}
        placeholder="Password"
        autoComplete="password"
        secureTextEntry={true}
      />

      <Button
        title="Register"
        onPress={handleRegisterPress}
      />
    </View>
  );
}

export default RegisterScreen;