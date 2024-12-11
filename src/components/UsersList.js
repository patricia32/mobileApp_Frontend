import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';


export default function UsersList({ navigation, route, closeModal, usersListType, postID, userToGetData }) {
    const {  loggedInUserID } = route.params;
    const [usersList, setUsersList] = useState([]);
    

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const redirectToProfile = (username) => {
        closeModal();
        navigation.navigate('Profile', {loggedInUserID, accessedProfileUserID: username});
    }

    // Fetch likes 
    const handleViewLikes = useCallback( async () => {
        try{
            const response = await fetch(`http://192.168.1.129:5000/post/getLikes?postID=${postID}`);
            const usersList = await response.json();

            if(response.ok)
                setUsersList(usersList);
            else
                setError(usersList.error || 'An error occurred');
        } catch(err){
            setError('Network error');
        } finally {
            setLoading(false);;
        }
    }, []);

    const handleViewFollowers = useCallback( async () => {
        try{
            const response = await fetch(`http://192.168.1.129:5000/getUserFollowersList?username=${userToGetData}`);
            const data = await response.json();
            if (response.ok) {
                const arrayData = Array.isArray(data) ? data : [data];
                setUsersList(arrayData);
            }
             else 
                setError(data.error || 'An error occurred');  
            
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);


    const handleViewFollowing = useCallback( async () => {
        try{
            const response = await fetch(`http://192.168.1.129:5000/getUserFollowingList?username=${userToGetData}`);
            const data = await response.json();
            if (response.ok) {
                const arrayData = Array.isArray(data) ? data : [data];
                setUsersList(arrayData);
            }
             else 
                setError(data.error || 'An error occurred');  
            
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        if(usersListType === 'likes')
            handleViewLikes();
        if(usersListType === 'followers')
            handleViewFollowers();
        if(usersListType === 'following')
            handleViewFollowing();
    } , []);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} onGoBack={() => navigation.goBack()} />;

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
