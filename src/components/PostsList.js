import {StyleSheet, View, Text, Image} from 'react-native';
import PostFeed from './PostFeed';
import { useEffect, useState } from 'react';

import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';

export default function PostsList({navigation, loggedInUserID}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false)

    // Fetch feed posts
    const getFeedPosts = async () => {
        setLoading(true);
        try{
            const response = await fetch(`http://192.168.1.129:5000/post/getFeedPosts?username=${loggedInUserID}`);
            const data = await response.json();

            if(response.ok)
                setPosts(data)
            else
                setError(data.error || 'An error occurred');
        } catch(err){
            setError('Network error');
        } finally {
            console.log(posts)
            setLoading(false);
        }
    }

    useEffect(() => {
        getFeedPosts();
    }, []); 



    if (loading) return <LoadingScreen/>;
    if (error) return <ErrorScreen error={error} onGoBack={() => navigation.goBack()} />;

    return(
        <View >
            {posts.map((post, index) => {
                return <PostFeed key={index} navigation={navigation} postData={[post]} loggedInUserID={loggedInUserID} />
            })}
        </View>
    );
}