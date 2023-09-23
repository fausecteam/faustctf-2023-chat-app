import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

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

type Props = NativeStackScreenProps<RootStackParamList, 'CreateChat'>;

function CreateChat({ navigation }: Props) {
    const [guest, setGuest] = useState('');

    const handleChatCreate = async () => {
        try {
            const msg = {
                guest
            };

            const value = await AsyncStorage.getItem("user");
            const server = await AsyncStorage.getItem("server");
            axios.defaults.baseURL = `http://${server}:3000/`
            console.log('value:', value);

            if (value !== null) {
                const {data} = await axios.post('/chat', msg, {
                    headers: {
                        'X-Auth-Token': value
                    }
                });
                setGuest('');
                navigation.goBack();
                navigation.navigate('Chat', {chatId: data.data});
            }
        } catch (e) {
            console.error('Error', e);
        }
    };

    return (
        <View style={styles.view}>
            <Text>Create Chat</Text>

            <TextInput
                style={styles.input}
                onChangeText={setGuest}
                value={guest}
                placeholder="Guest Names"
            />

            <Button
                title="Send"
                onPress={handleChatCreate}
            />
        </View>
    );
}

export default CreateChat;