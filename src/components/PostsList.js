import {StyleSheet, View, Text, Image} from 'react-native';
import PostFeed from './PostFeed';


export default function PostsList({navigation, loggedInUserID}) {
    posts = [
        {
            profilePic: require('../../assets/corinaProfilePic.png'),
            userID: 2,
            userName: 'Corina Dragotoniu',
            postPhoto: require('../../assets/corinaPostImage.png'),
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
        },
        {
            profilePic: require('../../assets/profilePic.png'),
            userID: 3,
            userName: 'Post 1',
            postPhoto: require('../../assets/portraitPostPic.png'),
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
                    commentText: 'This is the first comment comment comment comment comment comment comment comment comment comment comment ',
                    date: '2024-09-01'
                },
                {
                    commentUser: 'User2',
                    commentText: 'This is another comment',
                    date: '2024-09-02'
                },
                {
                    commentUser: 'User3',
                    commentText: 'Great post!',
                    date: '2024-09-03'
                },
                {
                    commentUser: 'User1',
                    commentText: 'This is the first comment',
                    date: '2024-09-01'
                },
                {
                    commentUser: 'User2',
                    commentText: 'This is another comment',
                    date: '2024-09-02'
                },
                {
                    commentUser: 'User3',
                    commentText: 'Great post!',
                    date: '2024-09-03'
                },
                {
                    commentUser: 'User1',
                    commentText: 'This is the first comment',
                    date: '2024-09-01'
                },
                {
                    commentUser: 'User2',
                    commentText: 'This is another comment',
                    date: '2024-09-02'
                },
                {
                    commentUser: 'User3',
                    commentText: 'Great post!',
                    date: '2024-09-03'
                },
                {
                    commentUser: 'User1',
                    commentText: 'This is the first comment',
                    date: '2024-09-01'
                },
                {
                    commentUser: 'User2',
                    commentText: 'This is another comment',
                    date: '2024-09-02'
                },
                {
                    commentUser: 'User3',
                    commentText: 'Great post!',
                    date: '2024-09-03'
                }
            ]
        },
        {
            profilePic: require('../../assets/profilePic.png'),
            userID: 4,
            userName: 'Post 2',
            postPhoto: require('../../assets/postPic.png'),
            likes: [
                {
                    likeUser: 'User1',
                },
                {
                    likeUser: 'User2',
                }
            ],
            comments: [
                {
                    commentUser: 'User1',
                    commentText: 'This is the first comment',
                    date: '2024-09-06',
                },
                {
                    commentUser: 'User2',
                    commentText: 'This is another comment',
                    date: '2024-09-07',
                },
                {
                    commentUser: 'User3',
                    commentText: 'Great post!',
                    date: '2024-09-08',
                }
            ]
        },
        {
            profilePic: require('../../assets/profilePic.png'),
            userID: 5,
            userName: 'Post 3',
            postPhoto: require('../../assets/profilePic.png'),
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
                    date: '2024-09-11',
                },
                {
                    commentUser: 'User2',
                    commentText: 'This is another comment',
                    date: '2024-09-12',
                },
                {
                    commentUser: 'User3',
                    commentText: 'Great post!',
                    date: '2024-09-13',
                }
            ]
        }
    ]
    return(
        <View >
            {posts.map((postData, index) => {
                return <PostFeed key={index} navigation={navigation} postData={postData} loggedInUserID={loggedInUserID} />
            })}
        </View>
    );
}