type RootStackParamList = {
    Welcome: undefined;
    Home: undefined;
    Login: undefined;
    Register: undefined;
    CreateChat: undefined;
    Chat: { chatId: number };
    Profile: { userId: string };
    Feed: { sort: 'latest' | 'top' } | undefined;
};
