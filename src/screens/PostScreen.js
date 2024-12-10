import React from 'react';  
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Post from '../components/PostFeed';

export default function PostScreen({ navigation, route}) {
    const { username, postID, loggedInUserID } = route.params;

    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // Fetch post data from the server using the postData(username and postID)
    const getPostData = async () => {
        try{
            const response = await fetch(`http://192.168.1.129:5000/post/getPostData?postID=${postID}&username=${username}`);
            const postData = await response.json();

            if(response.ok)
                setPostData(postData);
             else 
                setError(postData.error || 'An error occurred');
            
        } catch(err){
            setError('Network error');
        } finally{
            setLoading(false);
        }
    }
    

    useEffect(() => {
        getPostData();
    }, []);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.postContent}>
                <Post postData={postData} navigation={navigation} loggedInUserID={loggedInUserID}/>
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