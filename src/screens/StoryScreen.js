import { useCallback, useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image, StatusBar, TextInput, Modal, Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openStoryWithIndex} from '../components/StoriesList';
import ForwardStoryImage from '../components/ForwardStoryImage';

export default function StoryScreen({ route, navigation }) {


    ///     LIKED STORY REQUEST         


    const userFriends = [
        {
            id: 1,
            userName: 'John Doe',
            userProfilePicture: 'https://randomuser.me/api/portraits',
        },
        {
            id: 2,
            userName: 'Patri',
            userProfilePicture: 'https://randomuser.me/api/portraits',
        },
    ];

    const { storyData } = route.params;
    const [message, setMessage] = useState('');
    const [heartColor, setHeartColor] = useState('black');
    const [currentIndex, setCurrentIndex] = useState(0);  
    const [storyDisplayingTime, setStoryDisplayingTime] = useState(3000); 
    const timerRef = useRef(null); 
    const [modalType, setModalType] = useState(null); 


    const closeStory = () => {
        navigation.goBack();
    };

    
    const handleHeartButton = useCallback(() => {
        setHeartColor(prevColor => (prevColor === 'black' ? 'red' : 'black'));
    }, []);
    
    const handleSendMessage = () => {
        clearTimeout(timerRef.current); 
        setMessage(message); 
        console.log('Mesaj adaugat:', message);
    };


    const closeModal = useCallback(() => {
        setModalType(null); 

        // Restart the autoplay timer
        timerRef.current = setTimeout(() => {
            handleNextStoryImage();
        }, storyDisplayingTime);
        
    }, [storyDisplayingTime, handleNextStoryImage]);


    const handleForwardStoryImage = useCallback(() => {
        clearTimeout(timerRef.current);
        setModalType('forwardStoryImage');
    }, []);


    useEffect(() => {
        clearTimeout(timerRef.current);

        // Set the timer to display the next story image
        timerRef.current = setTimeout(() => {
            handleNextStoryImage();
        }, storyDisplayingTime);

        return () => clearTimeout(timerRef.current);
    }, [currentIndex, storyDisplayingTime]);


    // Display the previous story image
    const handlePreviousStoryImage = () => {
        Keyboard.dismiss();
        setHeartColor('black');
        if (currentIndex > 0) 
            setCurrentIndex(prevIndex => prevIndex - 1);
        else{
                openStoryWithIndex(storyData.userID-1, navigation)
                setCurrentIndex(0);
                setStoryDisplayingTime(3000);
                setHeartColor('black');
        }
    };

    // Display the next story image
    const handleNextStoryImage = () => {
        Keyboard.dismiss(); 
        setHeartColor('black');
        if (currentIndex < storyData.storyImages.length - 1) 
            setCurrentIndex(prevIndex => prevIndex + 1);
        else{
            
            openStoryWithIndex(storyData.userID+1, navigation)
            setCurrentIndex(0);
            setStoryDisplayingTime(3000);
            setHeartColor('black');
        }
    };

    return (
        
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <StatusBar 
                    barStyle="light-content" 
                    backgroundColor="black" 
                />
                
                {/*Stories horizontal top lines */}
                <View style={styles.horizontalLines}>
                    {storyData.storyImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.horizontalLine,
                                { flex: 1 / storyData.storyImages.length }, 
                                index === storyData.storyImages.length - 1 && { marginRight: 17 }, 
                                index <= currentIndex && { backgroundColor: 'white' }, 
                            ]}
                        />
                    ))}
                </View>

                {/* Story header - user data*/}
                <View style={styles.storyHeader}>
                    <TouchableOpacity style={styles.storyUserData}>
                        <Image
                            source={{ uri: storyData.userProfilePicture }}
                            style={styles.storyUserImage}
                        />
                        <Text style={styles.storyUserName}>{storyData.userName}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={closeStory} style={styles.closeButton}>
                        <Feather name="x" size={25} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Story content  */}
                <View style={styles.storyContent}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: storyData.storyImages[currentIndex] }}
                            style={styles.image}
                        />
                        <TouchableOpacity style={styles.leftSide} onPress={handlePreviousStoryImage} />
                        <TouchableOpacity style={styles.rightSide} onPress={handleNextStoryImage} />
                    </View>
                </View>

                {/* Story interactions - message field, heart and forward buttons */}
                <View style={styles.storyInteraction}>
                    <TextInput 
                        style={styles.storyReplyField} 
                        placeholder="Send a message..." 
                        placeholderTextColor="white"
                        onPress={handleSendMessage}
                        onChangeText={handleSendMessage}
                    />
                    <TouchableOpacity style={styles.iconArea} onPress={handleHeartButton}>
                        <MaterialComunityIcons 
                            name={heartColor === 'black' ? "cards-heart-outline" : "cards-heart"} 
                            size={27} 
                            style={styles.icon} 
                            color={heartColor} 
                        />
                    </TouchableOpacity>
                    


                    {/* forwardStoryImage modal */}
                   
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalType === 'forwardStoryImage'}
                            onRequestClose={closeModal}
                        >
                            <View style={styles.modalForwardStoryImageContainer}>
                                <View style={styles.modalForwardStoryImageContent}>
                                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                        <Feather name="x" size={24} color="black" />
                                    </TouchableOpacity>
                                    <Text style={styles.modalForwardStoryImageTitle}>Forward to</Text>
                                    <ForwardStoryImage friends={userFriends} />
                                </View>
                            </View>
                        </Modal>
            

                    <TouchableOpacity style={styles.iconArea} onPress={handleForwardStoryImage}>
                        <Feather name="send" size={27} style={styles.icon} />
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },

    storyHeader: {
        flexDirection: 'row',
        position: 'absolute',
        height: 50,
        top: 8,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    horizontalLines: {
        flexDirection: 'row', 
        marginBottom: 5,
        width: '100%',
        justifyContent: 'space-between',
        position: 'absolute',
        zIndex: 1,
        marginLeft: 8,
        marginRight: 17,
      },
    
      horizontalLine: {
        height: 2.5, 
        borderRadius: 2, 
        marginHorizontal: 2, 
        backgroundColor: 'rgba(255,255,255,0.4)',
        marginVertical: 5,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.7, 
        shadowRadius: 4, 
        elevation: 10,
      },


    storyUserImage: {
        height: 35,
        width: 35,
        borderRadius: 20,
    },
    storyUserData: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storyUserName: {
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 10,
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },
    closeButton: {
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
    },

    storyContent: {
        flex: 0.9,
    },

    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative', 
    },

    leftSide: {
        position: 'absolute',
        top: 50,
        left: 0,
        width: '50%', 
        height: '90%',
        zIndex: 1, 
    },

    rightSide: {
        position: 'absolute',
        top: 50,
        bottom: 50,
        right: 0,
        width: '50%',
        height: '90%',
        zIndex: 1, 
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
        borderRadius: 10,
    },

    storyInteraction: {
        backgroundColor: 'black',
        flex: 0.1,
        flexDirection: 'row',
    },

    storyReplyField: {
        backgroundColor: 'black',
        paddingLeft: 10,
        borderWidth: 1.1,
        borderColor: 'darkgrey',
        borderRadius: 25,
        margin: 15,
        flex: 0.75,
        height: 42,
        alignSelf: 'center',
        fontSize: 16,
        color: 'white',
    },

    iconArea: {
        flex: 0.12,
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon: {
        alignSelf: 'center',
        marginRight: 0,
        color: 'white',
    },

    modalForwardStoryImageContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalForwardStoryImageContent: {
        width: '100%',
        height: '70%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalForwardStoryImageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
