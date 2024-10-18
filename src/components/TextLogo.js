import { Image, StyleSheet, Text, TextInput, View, TouchableOpacity, Button, SafeAreaView, StatusBar } from 'react-native';

export default function TextLogo() {
    return(
        <Image 
            style={styles.logoText}
            source={require('../../assets/textLogo.png')} />
    );
}

const styles = StyleSheet.create({
    logoText: {
      width: 300,
      height: 100,
      marginBottom: 50,
      alignSelf: 'center',
    },
});