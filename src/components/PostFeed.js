import { StyleSheet, View, Text, Image, TouchableWithoutFeedback, Animated, TouchableOpacity, Modal } from 'react-native';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Comments from './Comments';
import Likes from './Likes';
import Icon from 'react-native-vector-icons/Feather';

export default function Post({ navigation, postData, loggedInUserID }) {
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
        setFooterHeartColor(prevColor => (prevColor === 'black' ? 'red' : 'black'));
    }, []);

    const handleCommentButton = useCallback(() => {
        setModalType(modalType === 'comments' ? null : 'comments');
    }, [modalType]);

    const handleSettingsButton = useCallback(() => {
        console.log(loggedInUserID)
        console.log(postData.userID)
    }, []);
    
    const handleViewLikes = useCallback(() => {
        setModalType(modalType === 'likes' ? null : 'likes');
    }, [modalType]);

    const closeModal = useCallback(() => {
        setModalType(null);
    }, []);

    useEffect(() => {
        return () => {
            clearTimeout(tapTimeout.current);
        };
    }, []);

    const redirectToUserProfile = () => {
        console.log('Redirect to user profile');
        navigation.navigate('Profile', { loggedInUserID, accessedProfileUserID: postData.userID });
    }

    return (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerLeft} onPress={redirectToUserProfile}>
                    <Image 
                        style={styles.profilePic}
                        source={postData.profilePic} 
                    />
                    <View style={styles.headerName}>
                        <Text style={styles.headerNameText}>{postData.userName}</Text>
                    </View>
                </TouchableOpacity>

                {postData.userID === loggedInUserID && (
                    <TouchableOpacity style={styles.headerRight} onPress={handleSettingsButton}>
                        <Icon name="more-horizontal" size={25} color="black" />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableWithoutFeedback onPress={handleTap}>
                <View>
                    <Image 
                        style={styles.postPhoto}
                        source={postData.postPhoto} 
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
                    {footerHeartColor === 'red' ? ( 
                        <MaterialCommunityIcons 
                            name="cards-heart" 
                            size={30} 
                            color={footerHeartColor} 
                            style={{ marginLeft: 7 }} 
                        />
                    ) : (
                        <MaterialCommunityIcons 
                            name="cards-heart-outline" 
                            size={30} 
                            color={footerHeartColor} 
                            style={{ marginLeft: 7 }} 
                        />
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={handleCommentButton} accessibilityLabel="Comment on post">
                    <Feather name="message-circle" size={28} color="black" style={{ marginLeft: 12 }} />
                </TouchableOpacity>

                <Feather name="send" size={27} color="black" style={{ marginLeft: 12 }} />
            </View>

            <View style={styles.postInteractions}>
                {postData.likes.length !== 0 && (
                    <TouchableOpacity onPress={handleViewLikes} accessibilityLabel="View likes">
                        <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{postData.likes.length} likes</Text>
                    </TouchableOpacity>
                )}
                {postData.comments.length !== 0 && (
                    <TouchableOpacity onPress={handleCommentButton} accessibilityLabel="View comments">
                        <Text style={{ marginBottom: 4, fontWeight: 'bold' }}>{postData.comments.length} comments</Text>
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
                            <Comments comments={postData.comments} />
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
                            <Likes likes={postData.likes} />
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
        // justifyContent: 'flex-start',
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
