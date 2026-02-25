import React, { useState } from 'react';
import { StyleSheet, Modal, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Text, View } from './Themed';
import Colors from '@/constants/Colors';
import { ScamService } from '@/services/ScamService';
import { MaterialIcons } from '@expo/vector-icons';

const theme = Colors.light;

interface ScamReportModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ScamReportModal({ visible, onClose }: ScamReportModalProps) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);

    const pickImage = async () => {
        Alert.alert("Simulated Picker", "Image selected: evidence_photo_01.jpg");
        setImageUri('file:///mock/path/evidence.jpg');
    };

    const handleSubmit = async () => {
        if (text.trim().length < 10) {
            Alert.alert("Error", "Please provide a bit more detail (at least 10 characters).");
            return;
        }

        setLoading(true);
        try {
            let evidenceUrl = undefined;
            let evidenceType = undefined;

            if (imageUri) {
                const uploadResult = await ScamService.uploadEvidence(imageUri);
                evidenceUrl = uploadResult.url;
                evidenceType = uploadResult.type;
            }

            await ScamService.reportScam({
                text,
                lat: 41.8892,
                lon: 12.4687,
                userId: 'user_alex_123',
                evidenceUrl,
                evidenceType
            });
            Alert.alert("Success", "Your report has been received and is being analyzed by our AI engine.");
            setText('');
            setImageUri(null);
            onClose();
        } catch (error) {
            Alert.alert("Error", "Failed to submit report. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Report a Scam</Text>
                    <Text style={styles.modalSub}>Describe what happened to help other travelers stay safe.</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="e.g. A taxi driver at the airport tried to charge me 100 Euro for a 20 Euro ride..."
                        placeholderTextColor={theme.textSecondary}
                        multiline
                        numberOfLines={4}
                        value={text}
                        onChangeText={setText}
                    />

                    <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                        <MaterialIcons name="add-a-photo" size={20} color={imageUri ? theme.safe : theme.tint} />
                        <Text style={[styles.uploadText, imageUri && { color: theme.safe }]}>
                            {imageUri ? "Evidence Attached ✓" : "Attach Photo Evidence"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitButton, loading && styles.disabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitText}>Submit Report</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalView: {
        width: '90%',
        backgroundColor: theme.card,
        borderRadius: 24,
        padding: 30,
        borderWidth: 1,
        borderColor: theme.border,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.text,
        marginBottom: 8,
    },
    modalSub: {
        fontSize: 14,
        color: theme.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    input: {
        backgroundColor: theme.subtle,
        borderRadius: 12,
        padding: 16,
        height: 120,
        textAlignVertical: 'top',
        fontSize: 15,
        color: theme.text,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: theme.border,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
        borderStyle: 'dashed',
        marginBottom: 24,
        backgroundColor: 'transparent',
    },
    uploadText: {
        marginLeft: 10,
        fontSize: 14,
        fontWeight: '600',
        color: theme.tint,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginRight: 10,
    },
    cancelText: {
        color: theme.textSecondary,
        fontWeight: '700',
    },
    submitButton: {
        backgroundColor: theme.tint,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
    },
    submitText: {
        color: 'white',
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.5,
    }
});
