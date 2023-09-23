import React, { useState, useEffect } from 'react';
import { Text, View, Button, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chatBox: {
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function HomeScreen({ navigation }: Props) {
  const [chats, setChats] = useState([{ id: -1 }]);

  const handleLogoutPress = () => {
    // Create a data object with the user-provided data
    AsyncStorage.clear();
    navigation.navigate("Welcome");
  }

  const handleChatPress = (chatId: number) => {
    navigation.navigate('Chat', { chatId: chatId });
  }
  const handleChatCreate = () => {
    navigation.navigate('CreateChat');
  }

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("user");
        console.log('value:', value);
        const server = await AsyncStorage.getItem("server");
        axios.defaults.baseURL = `http://${server}:3000/`
        if (value !== null) {

          const { data } = await axios.get('/me', {
            headers: {
              'X-Auth-Token': value
            }
          });
          console.log(data.data);
          setChats(data.data);
        }
      } catch (e) {
        console.error('Error', e);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.view}>
      <Text>Home Screen</Text>
      <Button
        title="Log out"
        onPress={handleLogoutPress}
      />

      <FlatList
        data={chats}
        renderItem={({ item }) => {
          console.log('rendering', item);
          return (
            <TouchableOpacity style={styles.chatBox} onPress={() => handleChatPress(item.id)}>
              <Text>{item.id}</Text>
            </TouchableOpacity>
          )
        }
        }
      />

      <Button
        title="Add Chat"
        onPress={handleChatCreate}
      />
    </SafeAreaView>
  );
}

export default HomeScreen;