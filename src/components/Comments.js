import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import LoadingScreen from '../screens/LoadingScreen';
import ErrorScreen from '../screens/ErrorScreen';

export default function Comments({ navigation, route, closeModal, postID }) {
    const [newComment, setNewComment] = useState('');
    const [comments, setCommentsList] = useState([]);
    const [profilePicPath, setProfilePicPath] = useState('');

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [keyboardIsVisible, setKeyboardIsVisible] = useState(false);

    const { loggedInUserID } = route.params;

    const scrollViewRef = useRef(null);

    // Fetch user profile picture path
    const getUserProfilePicPath = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://192.168.1.129:5000/user/getUserProfilePicPath?username=${loggedInUserID}`);
            const profilePicPath = await response.json();

            if (response.ok) {
                setProfilePicPath(profilePicPath.profilePicPath);
            } else {
                setError(profilePicPath.error || 'An error occurred');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }
     // Fetch comments 
     const getPostComments = useCallback( async () => {
        setLoading(true);
        try{
            const response = await fetch(`http://192.168.1.129:5000/post/getComments?postID=${postID}`);
            const comments = await response.json();

            if(response.ok)
                setCommentsList(comments);
            else
                setError(comments.error || 'An error occurred');
        } catch(err){
            setError('Network error');
        } finally {
            setLoading(false);
        }
    }, []);


    // Submit comment
    const handleCommentSubmit = async () => {
        setLoading(true);
        setIsSubmitting(true);

        const commentText = newComment;
        const userUsername = loggedInUserID;
    
        if (!commentText || !postID || !userUsername) return;
    
        try {
            const response = await fetch('http://192.168.1.129:5000/post/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postID, userUsername, commentText }), 
            });
    
            if (response.ok) 
                console.error('Error:', await response.json());
            else 
                console.error('Error:', await response.json());
            
        } catch (err) {
            // console.error('Network error:', err);
        } finally {
            setNewComment(''); 
            setIsSubmitting(false); 
            setLoading(false);
            getPostComments  ();
            setKeyboardIsVisible(false);
        }

    };
    
    const redirectToProfile = (username) => {
        closeModal();
        navigation.navigate('Profile', { loggedInUserID, accessedProfileUserID: username });
    }


    useEffect(() => {
        getPostComments();
        getUserProfilePicPath();
    }, []);

    const dismissKeyboard = () => {
        if(keyboardIsVisible){
            setKeyboardIsVisible(false);
            Keyboard.dismiss();
        }
    };

    if(loading) return <LoadingScreen />;
    if(error) return <ErrorScreen error={error} onGoBack={() => navigation.goBack()} />;
    return (
        <View style={styles.mainContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1, 
                }}
            >
                <View style={styles.commentsContainer}>
                        <ScrollView
                            contentContainerStyle={styles.container}
                            keyboardShouldPersistTaps="handled"
                            >
                            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                            <View style={styles.commentList}>
                                {comments.map((comment, index) => (
                                    <View style={styles.photo_content} key={index}>
                                        <TouchableOpacity onPress={() => redirectToProfile(comment.userUsername)} >
                                            <Image style={styles.userProfilePic} source={{ uri: comment.profilePicPath }} />
                                        </TouchableOpacity>

                                        <View style={styles.comment}>
                                            <View style={styles.name_date}>
                                                <TouchableOpacity onPress={() => redirectToProfile(comment.userUsername)}>
                                                    <Text style={styles.commentUser}>{comment.userUsername}</Text>
                                                </TouchableOpacity>
                    
                                                <Text style={styles.commentDate}>
                                                    {new Date(comment.date).toLocaleString('en-US', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </Text>
                                            </View>
                                            <Text style={styles.commentText}>{comment.commentText}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                        </ScrollView>
                    
                   {/* Comment input section */}
                    <View style={[styles.newCommentContainer, { position: keyboardIsVisible ? 'absolute' : 'relative', top: keyboardIsVisible ? 0 : 'auto' }]}>
                        <Image style={styles.userProfilePic} source={{ uri: profilePicPath }} />
                        <TextInput
                            style={styles.commentField}
                            placeholder="Add a comment..."
                            value={newComment}
                            onChangeText={text => {
                                setNewComment(text);
                                setKeyboardIsVisible(true);
                            }}
                        />
                        <TouchableOpacity onPress={handleCommentSubmit} disabled={isSubmitting}>
                            <Text style={[styles.submitButton, isSubmitting && { color: '#aaa' }]}>
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentsContainer: {
        flex: 1,
        marginTop: 10,
    },
    commentList: {
        flexGrow: 1,
    },
    comment: {
        flexDirection: 'column',
        marginBottom: 25,
    },
    photo_content: {
        flexDirection: 'row',
    },
    name_date: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    commentUser: {
        fontWeight: 'bold',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    commentDate: {
        marginLeft: 10,
        color: '#808080',
        fontSize: 12,
        alignSelf: 'center',
    },

    // New comment styles
    newCommentContainer: {
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    userProfilePic: {
        width: 40,
        height: 40,
        borderRadius: 35,
        marginRight: 10,
    },
    commentField: {
        height: 50,
        width: '75%',
        backgroundColor: '#f9f9f9',
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    submitButton: {
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#2196F3',
    },
});
