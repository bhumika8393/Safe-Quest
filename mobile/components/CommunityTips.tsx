import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Config from '@/constants/Config';

const theme = Colors.light;

interface Tip {
    id: string;
    userId: string;
    content: string;
    upvotes: number;
    locationLabel: string;
    createdAt: string;
}

export default function CommunityTips({ location }: { location: string }) {
    const [tips, setTips] = useState<Tip[]>([]);
    const [newTip, setNewTip] = useState('');
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);

    const fetchTips = async () => {
        try {
            const response = await fetch(`${Config.API_URL}/safety/tips?location=${location}`);
            const data = await response.json();
            setTips(data);
        } catch (error) {
            console.error('Fetch Tips Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTips();
    }, [location]);

    const handlePostTip = async () => {
        if (newTip.trim().length < 5) {
            Alert.alert("Brief Tip", "Please share a bit more detail.");
            return;
        }

        setPosting(true);
        try {
            const response = await fetch(`${Config.API_URL}/safety/tips`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'user_alex_123',
                    content: newTip,
                    location: location
                })
            });

            if (response.ok) {
                setNewTip('');
                fetchTips();
            }
        } catch (error) {
            Alert.alert("Error", "Failed to post tip. Check connection.");
        } finally {
            setPosting(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ margin: 20 }} color={theme.tint} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Community Safety Tips</Text>

            <View style={styles.inputRow}>
                <TextInput
                    style={styles.input}
                    placeholder="Share a safety tip for this area..."
                    placeholderTextColor={theme.textSecondary}
                    value={newTip}
                    onChangeText={setNewTip}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.postButton, posting && { opacity: 0.5 }]}
                    onPress={handlePostTip}
                    disabled={posting}
                >
                    <Ionicons name="send" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={tips}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={styles.tipCard}>
                        <View style={styles.tipHeader}>
                            <FontAwesome name="user-circle" size={16} color={theme.textSecondary} />
                            <Text style={styles.tipUser}>{item.userId.substring(0, 8)}...</Text>
                            <Text style={styles.tipTime}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                        </View>
                        <Text style={styles.tipContent}>{item.content}</Text>
                        <View style={styles.tipFooter}>
                            <TouchableOpacity style={styles.upvoteButton}>
                                <Ionicons name="caret-up" size={18} color={theme.safe} />
                                <Text style={styles.upvoteText}>{item.upvotes}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No tips yet. Be the first to help!</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        color: theme.text,
        marginBottom: 15,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 12,
        fontSize: 14,
        color: theme.text,
        borderWidth: 1,
        borderColor: theme.border,
        maxHeight: 100,
    },
    postButton: {
        backgroundColor: theme.tint,
        width: 48,
        height: 48,
        borderRadius: 12,
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipCard: {
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.border,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    tipUser: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.textSecondary,
        marginLeft: 6,
    },
    tipTime: {
        fontSize: 10,
        color: theme.textSecondary,
        marginLeft: 'auto',
    },
    tipContent: {
        fontSize: 14,
        color: theme.text,
        lineHeight: 20,
    },
    tipFooter: {
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: 'transparent',
    },
    upvoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    upvoteText: {
        fontSize: 12,
        fontWeight: '700',
        color: theme.safe,
        marginLeft: 4,
    },
    emptyText: {
        textAlign: 'center',
        color: theme.textSecondary,
        paddingVertical: 20,
        fontSize: 14,
    }
});
