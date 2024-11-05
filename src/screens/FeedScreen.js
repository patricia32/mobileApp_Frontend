import React, { useState, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, SafeAreaView, StatusBar, ScrollView, KeyboardAvoidingView, TouchableOpacity, Platform, Animated } from 'react-native';
import Footer from '../components/Footer';
import FeedHeader from '../components/FeedHeader';
import PostsList from '../components/PostsList';
import Post from '../components/Post';

export default function FeedScreen({ navigation }) {

    const scrollViewRef = useRef(null);

    const [showHeader, setShowHeader] = useState(true); // State to control the visibility of the header
    const scrollY = useRef(new Animated.Value(0)).current; // To track the scroll position

    // Handle the scroll event
    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event) => {
                const currentOffset = event.nativeEvent.contentOffset.y;
                if (currentOffset > 50) {
                    setShowHeader(false); // Hide header when scrolling down
                } else {
                    setShowHeader(true); // Show header when scrolling up or on top
                }
            }
        }
    );


    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <SafeAreaView style={styles.fullPage}>
  
                <StatusBar barStyle="dark-content" />

                 {showHeader && <FeedHeader />}

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.stories}>
                        <Text>Stories</Text>
                    </View>

                    <View style={styles.posts}>
                        <Text>Feed Screen</Text>
                        <PostsList/>
                    </View>

                </ScrollView>
                
                <Footer />
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
        flex: 0.15,
        backgroundColor: '#ff0',
    },
    posts: {
      flex: 0.85,
      backgroundColor: '#fff',
    },
});  