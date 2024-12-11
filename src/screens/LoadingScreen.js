import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#6200EE" style={styles.spinner} />
            <Text style={styles.loadingText}>Loading, please wait...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    spinner: {
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
    },
});
