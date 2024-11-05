import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

export default function Comments({ comments, onAddComment }) {
    const [newComment, setNewComment] = useState('');
    const scrollViewRef = useRef(null);


    const handleCommentSubmit = () => {
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment(''); 
        }
    };

    return (
        <View style={styles.mainContainer}>
                    <View style={styles.commentsContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.container}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.commentList}>
                            {comments.map((comment, index) => (
                                <View style={styles.photo_content}>
                                    <Image style={styles.userProfilePic} source={require('../../assets/profilePic.png')} />

                                    <View key={index} style={styles.comment}>
                                        <View style={styles.name_date}>
                                            <Text style={styles.commentUser}>{comment.commentUser}</Text>
                                            <Text style={styles.commentDate}>{comment.date}</Text>
                                        </View>
                                        <Text style={styles.commentText}>{comment.commentText}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                            </ScrollView>
                        </KeyboardAvoidingView>
                        <View style={styles.newCommentContainer}>
                            <Image style={styles.userProfilePic} source={require('../../assets/profilePic.png')} />
                            <TextInput
                                style={styles.commentField}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChangeText={text => setNewComment(text)}
                                onSubmitEditing={handleCommentSubmit} 
                            />
                            <TouchableOpacity onPress={handleCommentSubmit}>
                                <Text style={styles.submitButton}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
        </View>
    );
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
      },

    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    commentsContainer: {
        marginTop: 10,
        flex: 1, 
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
    },
    commentDate: {
        marginLeft: 10,
        color: '#808080',
        fontSize: 12,
        alignSelf: 'center',
    },

    // New comment styles
    newCommentContainer: {
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
