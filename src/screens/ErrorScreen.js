import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function ErrorScreen({ error, onGoBack }) {
    return (
        <View style={styles.container}>
            <MaterialIcons name="error-outline" size={80} color="#aaaaaa" />
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>{error || 'An unexpected error occurred.'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onGoBack}>
                <Text style={styles.retryButtonText}>Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    retryButton: {
        backgroundColor: '#aaaaaa',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    retryButtonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
});