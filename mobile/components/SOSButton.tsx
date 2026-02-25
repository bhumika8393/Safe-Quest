import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Pressable, Animated, Vibration } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

const theme = Colors.light;

interface SOSButtonProps {
    onTrigger: () => void;
    onCancel: () => void;
}

export default function SOSButton({ onTrigger, onCancel }: SOSButtonProps) {
    const [isPressing, setIsPressing] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startPress = () => {
        setIsPressing(true);
        setCountdown(3);
        Vibration.vibrate([0, 100, 50, 100]);

        Animated.timing(scaleAnim, {
            toValue: 0.9,
            duration: 3000,
            useNativeDriver: true,
        }).start();

        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    onTrigger();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const cancelPress = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }).start();
            setIsPressing(false);
            onCancel();
        }
    };

    return (
        <View style={styles.container}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    onPressIn={startPress}
                    onPressOut={cancelPress}
                    style={({ pressed }) => [
                        styles.button,
                        { backgroundColor: isPressing ? '#D32F2F' : theme.sos },
                    ]}
                >
                    {isPressing ? (
                        <View style={styles.content}>
                            <Text style={styles.countdownText}>{countdown}</Text>
                            <Text style={styles.label}>Keep Holding</Text>
                        </View>
                    ) : (
                        <View style={styles.content}>
                            <FontAwesome name="warning" size={48} color="white" />
                            <Text style={styles.buttonText}>SOS</Text>
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    button: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#FF4D4F',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    content: {
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: 'white',
        fontSize: 28,
        fontWeight: '900',
        marginTop: 8,
    },
    countdownText: {
        color: 'white',
        fontSize: 64,
        fontWeight: 'bold',
    },
    label: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 4,
    },
});
