import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Config from '@/constants/Config';

const theme = Colors.light;

export default function AIChatScreen() {
    const params = useLocalSearchParams();
    const [messages, setMessages] = useState([
        { id: 1, text: "Welcome to SafeQuest! Ask me anything about local laws, tipping, or transit in Rome.", sender: 'ai' },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (params.query) {
            sendMessage(params.query as string);
        }
    }, [params.query]);


    const sendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || inputText;
        if (textToSend.trim() === '') return;

        const userMsg = { id: Date.now(), text: textToSend, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        try {
            const response = await fetch(Config.ENDPOINTS.AI_CHAT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: textToSend, userId: 'user_alex_123' })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'ai'
            }]);
        } catch (error) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                text: "I'm offline right now—please check your connection.",
                sender: 'ai'
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={styles.chatContainer}>
                {messages.map(msg => (
                    <View key={msg.id} style={[
                        styles.messageWrapper,
                        msg.sender === 'user' ? styles.userWrapper : styles.aiWrapper
                    ]}>
                        <View style={[
                            styles.bubble,
                            msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                        ]}>
                            <Text style={msg.sender === 'user' ? styles.userText : styles.aiText}>
                                {msg.text}
                            </Text>
                        </View>
                    </View>
                ))}
                {isTyping && (
                    <View style={styles.aiWrapper}>
                        <View style={[styles.bubble, styles.aiBubble, { paddingVertical: 10 }]}>
                            <ActivityIndicator size="small" color={theme.tint} />
                        </View>
                    </View>
                )}
            </ScrollView>

            <View style={styles.quickSuggestions}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Tourist laws in Rome', 'Tipping etiquette', 'Bus ticket fine', 'Colosseum scam', 'Emergency numbers', 'Transport guide'].map(tip => (
                        <TouchableOpacity
                            key={tip}
                            style={styles.suggestionChip}
                            onPress={() => sendMessage(tip)}
                        >
                            <Text style={styles.suggestionText}>{tip}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.inputArea}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask SafeQuest AI..."
                    placeholderTextColor={theme.textSecondary}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => sendMessage()}
                />
                <TouchableOpacity style={styles.sendButton} onPress={() => sendMessage()}>
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    chatContainer: {
        padding: 20,
        paddingBottom: 40,
        backgroundColor: 'transparent',
    },
    messageWrapper: {
        marginBottom: 16,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    userWrapper: {
        justifyContent: 'flex-end',
    },
    aiWrapper: {
        justifyContent: 'flex-start',
    },
    bubble: {
        padding: 14,
        borderRadius: 20,
        maxWidth: '85%',
    },
    userBubble: {
        backgroundColor: theme.tint,
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        backgroundColor: theme.card,
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: theme.border,
    },
    userText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
    },
    aiText: {
        color: theme.text,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 22,
    },
    quickSuggestions: {
        paddingVertical: 12,
        paddingLeft: 20,
        backgroundColor: 'transparent',
    },
    suggestionChip: {
        backgroundColor: theme.card,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: theme.border,
    },
    suggestionText: {
        fontSize: 13,
        color: theme.tint,
        fontWeight: '600',
    },
    inputArea: {
        flexDirection: 'row',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
        backgroundColor: theme.card,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: theme.border,
    },
    input: {
        flex: 1,
        backgroundColor: theme.subtle,
        borderRadius: 25,
        paddingHorizontal: 20,
        height: 50,
        fontSize: 15,
        color: theme.text,
        marginRight: 12,
        borderWidth: 1,
        borderColor: theme.border,
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: theme.tint,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
