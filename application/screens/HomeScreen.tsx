import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import axios from 'axios';

import { Text, View, Button, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthContext } from '../stores/AuthContext';
import { Alert } from 'react-native';



function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {

  const { authToken, logout } = useContext(AuthContext);

  const [chats, setChats] = useState([]);

  const handleChatPress = (chatId: number) => {
    navigation.navigate('Chat', { chatId: chatId });
  }

  // const handleChatCreate = () => {
  //   let chatId = 0;
  //   navigation.navigate('Chat', { chatId: chatId });
  // }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Logout" onPress={logout} />
    });
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('/me', {
          headers: {
            'X-Auth-Token': authToken
          }
        });
        setChats(data.data);
      } catch (error) {
        Alert.alert('ERROR!', 'Something went wrong on our side. Please try again later.');
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.view}>
      <FlatList
        style={{ flex: 1 }}
        data={chats}
        renderItem={({ item }) => {
          console.log('rendering', item);
          return (
            <TouchableOpacity
              style={styles.chatBox}
              onPress={() => handleChatPress(item.id)}
            >
              <Text>{item.id}</Text>
            </TouchableOpacity>
          )
        }
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: 'stretch',
  },
  chatBox: {
    flex: 1,
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default HomeScreen;