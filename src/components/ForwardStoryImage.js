import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function ForwardStoryImage({ friends }) {
    return (
        <View style={styles.mainContainer}>
            <View style={styles.friendsContainer}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.friendsList}>
                        {friends.map((friend, index) => (
                            <TouchableOpacity key={index} style={styles.photo_content}>
                                <Image 
                                    style={styles.userProfilePic} 
                                    source={require('../../assets/profilePic.png')}
                                />
                                <Text style={styles.friendUser}>{friend.userName}</Text>
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
    friendContainer: {
        flex: 1,
    },
    friendsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    friendsList: {
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
    friendUser: {
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
