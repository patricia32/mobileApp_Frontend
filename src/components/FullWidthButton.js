import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import React from 'react';
export default function FullWidthButton({ title, onPress }) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
button: {
    width: '85%', 
    backgroundColor: 'rgb(0, 149, 246)',
    borderRadius: 5,
    marginTop: 20,
    height: 40,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    padding: 10,
    textAlign: 'center',
  },
});