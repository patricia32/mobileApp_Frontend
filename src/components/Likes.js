import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function Likes({ navigation, route, closeModal, usersList }) {
    const {  loggedInUserID } = route.params;
    
    const redirectToProfile = (username) => {
        closeModal();
        navigation.navigate('Profile', {loggedInUserID, accessedProfileUserID: username});
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.likesContainer}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.likeList}>
                        {usersList.map((user, index) => (
                            <TouchableOpacity key={index} style={styles.photo_content} onPress={() => redirectToProfile(user.username)}
                            >
                                <Image 
                                    style={styles.userProfilePic} 
                                    source={{uri: user.profilePicPath}}
                                />
                                <Text style={styles.likeUser}>{user.username}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
                
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
    },
    likesContainer: {
        flex: 1,
    },
    likesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    likeList: {
        flexGrow: 1,
    },
    photo_content: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    userProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    likeUser: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    closeButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    closeButton: {
        fontSize: 18,
        color: '#2196F3',
        fontWeight: 'bold',
    },
});
