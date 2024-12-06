import React from 'react';  
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Footer from '../components/Footer';
import Post from '../components/PostFeed';

export default function PostScreen({ navigation, route}) {
    const { userID, postID, loggedInUserID } = route.params;

    const getPostData = () => {
        // Fetch post data from the server using the postData(userID and postID)

        postData = {
            postID: 1,
            profilePic: require('../../assets/portraitPostPic.png'),
            userID: 1,
            userName: 'Patricia',
            postPhoto: require('../../assets/postPic.png'),
            likes: [
                {
                    likeUser: 'User1',
                },
                {
                    likeUser: 'User2',
                },
                {
                    likeUser: 'User3',
                }
            ],
            comments: [
                {
                    commentUser: 'User1',   
                    commentText: 'This is the first comment',   
                    date: '2024-09-01',
                },
            ]
        };

        return postData;
    };

    return(
        <SafeAreaView style={styles.container}>
            

            <View style={styles.postContent}>
                <Post postData={getPostData()} navigation={navigation} loggedInUserID={loggedInUserID}/>
                </View>

            <Footer navigation={navigation} loggedInUserID={loggedInUserID}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    postContent: {
        flex: 1,
    },
});