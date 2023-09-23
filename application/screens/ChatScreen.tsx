import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, Button, FlatList, TextInput, SafeAreaView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import { AuthContext } from '../stores/AuthContext';
import { Alert } from 'react-native';

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

function ChatScreen({ route }: NativeStackScreenProps<RootStackParamList, 'Chat'>) {

    const { authToken } = useContext(AuthContext);

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([{ user: "", content: "" }]);

    const { chatId } = route.params;

    const loadData = async () => {
        try {
            let chat = { "chat_id": chatId };
            const { data } = await axios.post('/chat_messages', chat, {
                headers: {
                    'X-Auth-Token': authToken
                }
            });
            setMessages(data.data);
        } catch (e) {
            Alert.alert('Error', 'Something went wrong on our side. Please try again later!');
        }
    }

    const handleSendMessage = async () => {
        try {
            const msg = {
                chat_id: chatId,
                message: message,
            };

            await axios.post('/message', msg, {
                headers: {
                    'X-Auth-Token': authToken
                }
            });
            setMessage('');
            loadData();
        } catch (e) {
            Alert.alert('Error', 'Something went wrong on our side. Please try again later!');
        }
    };

    useEffect(() => {
        loadData();
    }, [])

    return (
        <SafeAreaView style={styles.view}>
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
        </SafeAreaView>
    );
}

export default ChatScreen;