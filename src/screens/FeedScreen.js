import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, Animated } from 'react-native';
import Footer from '../components/Footer';
import FeedHeader from '../components/FeedHeader';
import PostsList from '../components/PostsList';
import StoriesList from '../components/StoriesList';

export default function FeedScreen({ navigation }) {

    const scrollViewRef = useRef(null);

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <SafeAreaView style={styles.fullPage}>
  
                <StatusBar barStyle="dark-content" />

                <FeedHeader />

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.stories}>
                        <StoriesList navigation={navigation}/>
                    </View>

                    <View style={styles.posts}>
                        <PostsList/>
                    </View>

                </ScrollView>
                
                <Footer navigation={navigation} />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    fullPage: {
      flex: 1,
      backgroundColor: '#fff',
    },
    container: {
      flexGrow: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    stories: {
        flex: 0.25,
    },
    posts: {
      flex: 0.75,
      backgroundColor: '#fff',
    },
});  