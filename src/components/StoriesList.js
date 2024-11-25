import {View, ScrollView} from 'react-native';
import StoryBullet from './StoryBullet';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


    const stories = [
        { 
            userID: 1,
            userProfilePicture: 'https://picsum.photos/201',
            // userProfilePicture: require('../../assets/patriProfilePic.png'),
            // userProfilePicture: loggedUserDetails ? loggedUserDetails.userProfilePicture : 'https://picsum.photos/201',
            userName: 'Your Story',
            storyImages: [
                'https://picsum.photos/201',
                'https://picsum.photos/202',
                'https://picsum.photos/203'
            ],
        },

        {
            userID: 2,
            userProfilePicture:  require('../../assets/corinaProfilePic.png'),
            userProfilePicture: 'https://picsum.photos/202',
            userName: 'Corina Dragotoniu',
            storyImages: [
                require('../../assets/corinaPostImage.png'),
            ],
        },
        
        {
            userID: 3,
            userProfilePicture: 'https://picsum.photos/203',
            userName: 'Alice',
            storyImages: [
                'https://picsum.photos/206',
                'https://picsum.photos/207'
            ],
        },
        
        {
            userID: 4,
            userProfilePicture: 'https://picsum.photos/204',
            userName: 'Bob',
            storyImages: [
                'https://picsum.photos/208',
                'https://picsum.photos/209'
            ],
        },
        {
            userID: 5,
            userProfilePicture: 'https://picsum.photos/205',
            userName: 'Charlie',
            storyImages: [
                'https://picsum.photos/210',
                'https://picsum.photos/211'
            ],
        }
    ];

    export const openStoryWithIndex = (userID, navigation) => {
        if (userID > stories.length || userID === 0) {
            navigation.goBack();
            return;
        }
        const storyData = stories.find(story => story.userID === userID);
        console.log(storyData);
        navigation.navigate('StoryScreen', { storyData, navigation });
    };
    export default function StoriesList({ navigation }) {


    return (

        <View >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {stories.map((storyData, index) => {
                    return <StoryBullet key={index} storyData={storyData} navigation={navigation} />
                })}
                </ScrollView>
        </View>
    );
}