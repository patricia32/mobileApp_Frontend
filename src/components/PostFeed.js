import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, Animated, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Comments from './Comments';
import UsersList from './UsersList';
import Icon from 'react-native-vector-icons/Feather';
import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';

export default function Post({ navigation, postData, loggedInUserID }) {
    
    const [postDataInstance, setPostDataInstance] = useState(postData[0]);
    const [postLikesNo, setPostLikesNo] = useState(0);
    const [postCommentsNo, setPostCommentsNo] = useState(0);

    const [liked, setLiked] = useState(undefined);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [heartVisible, setHeartVisible] = useState(false);
    const [modalType, setModalType] = useState(null); 
    const [scaleValue] = useState(new Animated.Value(1));
    const [footerHeartColor, setFooterHeartColor] = useState('black'); 
    const tapCount = useRef(0);
    const tapTimeout = useRef(null);   

    const handleTap = useCallback(() => {
        tapCount.current += 1;

        if (tapCount.current === 1) {
            tapTimeout.current = setTimeout(() => {
                tapCount.current = 0; 
            }, 300);
        } else if (tapCount.current === 2) { 
            clearTimeout(tapTimeout.current); 
            tapCount.current = 0; 

            likePost();
            setHeartVisible(true);
            setFooterHeartColor('red'); 

            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.5,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleValue, {
                    toValue: 1, 
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setHeartVisible(false); 
            });
        }
    }, [scaleValue]);

    const handleHeartButton = useCallback(() => {

        toggleLikeButton();
    }, []);

    const handleSettingsButton = useCallback(() => {
   
    }, []);
    

    // Fetch likes 
    const handleViewLikes = useCallback( async () => {

        setModalType(modalType === 'likes' ? null : 'likes');

    }, [modalType]);


    // Fetch comments 
    const handleCommentButton = useCallback( async () => {
        setModalType(modalType === 'comments' ? null : 'comments');
    }, [modalType]);


    const closeModal = useCallback(() => {
        getPostLikesAndCommentsNo();
        setModalType(null);
    }, []);


    //Check if the post is liked by the logged in user
    const checkIfLiked = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.129:5000/post/checkLike?postID=${postDataInstance.postID}&userUsername=${loggedInUserID}`);
            const liked = await response.json();

            if (response.ok) 
                setLiked(liked.isLiked);
            else
                setError(liked.error || 'An error occurred');

        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }

    // Fetch post likes and comments numbers
    const getPostLikesAndCommentsNo = async () => {
        try {
            const response = await fetch(`http://192.168.1.129:5000/post/getLikesNumber?postID=${postDataInstance.postID}`);
            const likesNo = await response.json();

            if (response.ok) {
                setPostLikesNo(likesNo.likesNumber);

                try{
                    const response = await fetch(`http://192.168.1.129:5000/post/getCommentsNumber?postID=${postDataInstance.postID}`);
                    const commentsNo = await response.json();

                    if(response.ok)
                        setPostCommentsNo(commentsNo.commentsNumber);
                    else
                        setError(commentsNo.error || 'An error occurred');
                } catch(err){
                    setError('Network error');
                } 
            }
            else
                setError(likesNo.error || 'An error occurred');
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }

    // Endpoints to like a post
    const likePost = async () => {
        if (liked) return;
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.129:5000/post/like`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    postID: postDataInstance.postID,
                    userUsername: loggedInUserID,
                }),
            });

            const result = await response.json(); 

            if (response.ok) 
                setLiked(true);

        } catch (err) {
            // setError('Network error');
        } finally {
            setLoading(false);
            checkIfLiked();
            getPostLikesAndCommentsNo();
        }
    }
            
    const toggleLikeButton = async () => {
        if (liked || liked === undefined) {
            // Unlike post
            setLoading(true);
            try {
                const response = await fetch(`http://192.168.1.129:5000/post/unlike`, {
                    method: 'DELETE', 
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({
                        postID: postDataInstance.postID,
                        userUsername: loggedInUserID,
                    }),
                });
    
                const result = await response.json(); 
    
                if (response.ok) 
                    setLiked(false);
                else
                    setError(result.error || 'An error occurred');
    
            } catch (err) {
                // setError('Network error');
            } finally {
                setLoading(false);
                checkIfLiked();
                getPostLikesAndCommentsNo();
            }
        }
        else 
            likePost();
    };


    useEffect(() => {
        checkIfLiked();
        getPostLikesAndCommentsNo();

        return () => {
            clearTimeout(tapTimeout.current);
        };
    }, []);

    const redirectToUserProfile = () => {
        navigation.navigate('Profile', { loggedInUserID, accessedProfileUserID: postDataInstance.userUsername });
    }

    if (loading) return <LoadingScreen/>;
    if (error) return <ErrorScreen error={error} onGoBack={() => navigation.goBack()} />;

    return (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={redirectToUserProfile}>
                    <Image 
                        style={styles.profilePic}
                        source={{uri: postDataInstance.profilePicPath}} 
                    />
                    
                    <View style={styles.headerName}>
                        <Text style={styles.headerNameText}>{postDataInstance.userUsername}</Text>
                    </View>
                </TouchableOpacity>

                {postDataInstance.userUsername === loggedInUserID && (
                    <TouchableOpacity style={styles.headerRight} onPress={handleSettingsButton}>
                        <Icon name="more-horizontal" size={25} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableWithoutFeedback onPress={handleTap}>
                <View>
                     <Image 
                        style={styles.postPhoto}
                        source={{ uri:postDataInstance.postPhotoPath} }
                    />
                    
                    {heartVisible && (
                        <Animated.View style={[styles.heart, { transform: [{ scale: scaleValue }] }]}>
                            <MaterialCommunityIcons name="heart" size={50} color="red" />
                        </Animated.View>
                    )}
                </View>
            </TouchableWithoutFeedback>


            <View style={styles.footer}>
                <TouchableOpacity onPress={handleHeartButton} accessibilityLabel="Like post">
                    {liked  ? ( 
                        <MaterialCommunityIcons 
                            name="cards-heart" 
                            size={30} 
                            color={'red'} 
                            style={{ marginLeft: 7 }} 
                        />
                    ) : (
                        <MaterialCommunityIcons 
                            name="cards-heart-outline" 
                            size={30} 
                            color={'black'} 
                            style={{ marginLeft: 7 }} 
                        />
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCommentButton} accessibilityLabel="Comment on post">
                    <Feather name="message-circle" size={28} color="black" style={{ marginLeft: 12 }} />
                </TouchableOpacity>

                <Feather name="send" size={27} color="black" style={{ marginLeft: 12 }} />
            </View>

            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>{postDataInstance.postDescription}</Text>
                <Text style={styles.timestampText}>
                    {new Date(postDataInstance.createdAt).toLocaleString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Text>
            </View>

            <View style={styles.postInteractions}>
                {postLikesNo !== 0 && (
                    <TouchableOpacity onPress={handleViewLikes} accessibilityLabel="View likes">
                        <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{postLikesNo} {postLikesNo === 1 ? 'like' : 'likes'}</Text>
                    </TouchableOpacity>
                )}
                {postCommentsNo !== 0 && (
                    <TouchableOpacity onPress={handleCommentButton} accessibilityLabel="View comments">
                        <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{postCommentsNo} {postCommentsNo === 1 ? 'comment' : 'comments'}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Comments modal */}
            {modalType === 'comments' && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalType === 'comments'}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalCommentsContainer}>
                        <View style={styles.modalCommentContent}>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Feather name="x" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalCommentTitle}>Comments</Text>
                            <Comments
                                        navigation={navigation}
                                        route={{ params: { loggedInUserID } }} 
                                        postID={postDataInstance.postID}
                                        //comments={commentsList}
                                        closeModal={closeModal} 
                            />
                        </View>
                    </View>
                </Modal>
            )}

            {/* Likes modal */}
            {modalType === 'likes' && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalType === 'likes'}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalCommentsContainer}>
                        <View style={styles.modalCommentContent}>
                            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                <Feather name="x" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalCommentTitle}>Likes</Text>
                            <UsersList
                                        navigation={navigation}
                                        route={{ params: { loggedInUserID } }} 
                                        closeModal={closeModal} 
                                        usersListType={'likes'}
                                        postID={postDataInstance.postID}
                            />
                            
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 7,
        marginTop: 10,
        marginLeft: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 0.9,
    },
    headerRight: {
        marginLeft: 'auto',
        flex: 0.1,
    },
    profilePic: {
        width: 30,
        height: 30,
        borderRadius: 35,
    },
    headerName: {
        marginLeft: 10, 
    },
    headerNameText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    postPhoto: {
        width: '100%',
        height: 400,
    },

    descriptionContainer: {
        padding: 10,
        marginLeft: 5,
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 5,
    },
    timestampText: {
        fontSize: 12,
        fontWeight: '300',
        color: '#777',
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 7,
        marginTop: 7,
    },
    postInteractions: {
        marginLeft: 15,
        marginTop: 5,
    },
    heart: {
        position: 'absolute',
        top: '40%', 
        left: '40%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    
    modalCommentsContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalCommentContent: {
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalCommentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 2, 
    },
});
