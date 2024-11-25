import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';


export default function StoryBullet({ storyData, navigation }) {

    const openStory = () => {
        navigation.navigate('StoryScreen', { storyData, navigation }); 
    };


    return (
        <TouchableOpacity onPress={openStory}>
            <View style={styles.storyContainer}>
                <View style={styles.storyCircle}>
                    <Image
                        source={{ uri: storyData.userProfilePicture }}
                        style={styles.storyUserPhoto}
                        />
                    <Text style={styles.userName}>{storyData.userName}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    storyContainer: {
        flexDirection: 'row',
        height: 110,
        backgroundColor: 'white',
        marginBottom: 14,
        marginTop: 10,
    },
    storyCircle: {
        height: 80,
        width: 80,
        borderRadius: 50,
        margin: 10,
        borderWidth: 3,
        borderColor: 'purple',
    },
    storyUserPhoto: {
        height: 71,
        width: 71,
        borderRadius: 50,
        alignSelf: 'center',
        marginTop: 1.5,
    },
    userName: {
        textAlign: 'center',
        marginTop: 9,
        marginBottom: 10,
        fontSize: 15,
    }
});