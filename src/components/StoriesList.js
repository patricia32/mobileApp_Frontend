import {View, ScrollView} from 'react-native';
import { useEffect, useState } from 'react';

import StoryBullet from './StoryBullet';
import React from 'react';

import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';


    let storiesOut = [];

    export const openStoryWithIndex = (viewedStory, navigation,loggedInUserID, goForward ) => { // goForward = true -> next story, goForward = false -> previous story
        
        const viewedStoryIndex = storiesOut.findIndex ( item => 
            item.followedUsername === viewedStory.followedUsername &&
            item.profilePicPath === viewedStory.profilePicPath &&
            item.storyID === viewedStory.storyID
        );

                // display previous story                        display next story
        if((!goForward && viewedStoryIndex === 0) || (goForward && viewedStoryIndex === storiesOut.length - 1)){
            navigation.goBack();
            return;
        }

        let targetStoryIndex;
        if(goForward)
            targetStoryIndex = viewedStoryIndex + 1;
        else
            targetStoryIndex = viewedStoryIndex - 1;

        const storyData = storiesOut[targetStoryIndex];
        navigation.navigate('StoryScreen', { storyData, navigation, loggedInUserID });
    };

    export default function StoriesList({ navigation, loggedInUserID }) {

        const [stories, setStories] = useState([]);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(false)
       
        const getStoryBulletsData = async () =>{
            setLoading(true);
            try{
                const response = await fetch(`http://192.168.1.129:5000/story/getStoriesData_bulletsList?username=${loggedInUserID}`);
                const data = await response.json();
                if(response.ok){
                    setStories(data)
                    storiesOut = data;
                }
                else
                    setError(data.error || 'An error occurred');
    
            } catch(err){
                setError('Network error');
            } finally {
                setLoading(false);
            }
        }
    
        useEffect(() => {
               getStoryBulletsData();
            }, []); 
    
            
    if (loading) return <LoadingScreen/>;
    if (error) return <ErrorScreen error={error} onGoBack={() => navigation.goBack()} />;

    return (

        <View >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {stories.map((storyData, index) => {
                    return <StoryBullet key={index} storyData={storyData} navigation={navigation} loggedInUserID={loggedInUserID}/>
                })}
                </ScrollView>
        </View>
    );
}