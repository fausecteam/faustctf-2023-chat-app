import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Chat'>;

function ChatScreen({ route }: Props) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([{ user: "", content: "" }]);

    const chatId = route.params.chatId;

    const loadData = async () => {
        try {
            const value = await AsyncStorage.getItem("user")
            console.log('value:', value);
            const server = await AsyncStorage.getItem("server");
            axios.defaults.baseURL = `http://${server}:3000/`
            if (value !== null) {
                let chat = { "chat_id": chatId };
                const { data } = await axios.post('/chat_messages', chat, {
                    headers: {
                        'X-Auth-Token': value
                    }
                });
                setMessages(data.data);
            }
        } catch (e) {
            console.log('Error', e);
        }
    }

    const handleSendMessage = async () => {
        try {
            // Create a data object with the user-provided data
            const msg = {
                chat_id: chatId,
                message: message,
            };

            const value = await AsyncStorage.getItem("user")
            console.log('value:', value);
            const server = await AsyncStorage.getItem("server");
            axios.defaults.baseURL = `http://${server}:3000/`

            if (value !== null) {
                await axios.post('/message', msg, {
                    headers: {
                        'X-Auth-Token': value
                    }
                });
                setMessage('');
                loadData();
            }
        } catch (e) {
            console.error('Error', e);
        }
    };

    useEffect(() => {
        // write your code here, it's like componentWillMount
        loadData();
    }, [])

    return (
        <View style={styles.view}>
            <Text>Chat {chatId}</Text>

            <FlatList
                data={messages}
                renderItem={({ item }) =>
                    <Text>{item.user}: {item.content}</Text>
                }
            />

            <TextInput
                style={styles.input}
                onChangeText={setMessage}
                value={message}
                placeholder="..."
            />

            <Button
                title="Send"
                onPress={handleSendMessage}
            />
        </View>
    );
}

export default ChatScreen;