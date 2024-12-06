import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, KeyboardAvoidingView, StatusBar, Platform, View, Image, TouchableOpacity, Modal, Button } from "react-native";
import React, {useCallback, useRef} from "react";
import Footer from "../components/Footer";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Likes from "../components/Likes";
import FullWidthButton from "../components/FullWidthButton";


export default function ProfileScreen({ navigation, route }) {
    const { loggedInUserID, accessedProfileUserID } = route.params;
    console.log('Profile Screen', loggedInUserID, accessedProfileUserID);

    

        // Fetch user content from the server using the accessedProfileUserID
    const userContent = {
        userId: 1,
        username: 'patricia32',
        bio: 'This is a test bio',
        profilePic: 'https://picsum.photos/201',
        posts: [
            {
                postId: 1,
                postImage: 'https://picsum.photos/201',
            },
            {
                postId: 2,  
                postImage: 'https://picsum.photos/202',
            },
            {
                postId: 3,
                postImage: 'https://picsum.photos/203',
            },
            {
                postId: 4,
                postImage: 'https://picsum.photos/204',
            },
            {
                postId: 5,
                postImage: 'https://picsum.photos/205',
            },
            {
                postId: 6,
                postImage: 'https://picsum.photos/206',
            },
            {
                postId: 7,
                postImage: 'https://picsum.photos/207',
            }
        ],
        followers: [
            {
                userId: 1,
                likeUser: 'user1',
                profilePic: 'https://picsum.photos/201',
            },
            {
                userId: 2,
                likeUser: 'user2',
                profilePic: 'https://picsum.photos/202',
            },
            {
                userId: 3,
                likeUser: 'user3',
                profilePic: 'https://picsum.photos/203',
            },
            {
                userId: 4,
                likeUser: 'user4',
                profilePic: 'https://picsum.photos/204',
            }],
        following: [
            {
                userId: 1,
                likeUser: 'user1',
                profilePic: 'https://picsum.photos/201',
            },
            {
                userId: 2,
                likeUser: 'user2',
                profilePic: 'https://picsum.photos/202',
            },
            {
                userId: 3,
                likeUser: 'user3',
                profilePic: 'https://picsum.photos/203',
            }],
    };

    const scrollViewRef = useRef(null);
    const [modalSettings, setModalSettings] = React.useState(false);
    const [modalType, setModalType] = React.useState(false); // followers and following
    const postsRowsNo = Math.ceil(userContent.posts.length / 3);
    

    const handleSettingsButton = () => {
        console.log('Settings button pressed');
        setModalSettings(true);
    };

    const closeModal = useCallback(() => {
        setModalSettings(false);
    }, []);

    const handleEditProfile = () => {
        console.log('Edit Profile button pressed');
    };

    const handleLogOut = () => {
        setModalSettings(false);
        navigation.navigate('Login');
    };

    const handleFollowers = () => {
        setModalType('followers')
        // get followers users
        console.log('Followers button pressed');
    };

    const handleFollowing = () => {
        setModalType('following')
        // get following users
        console.log('Following button pressed');
    };

    const closeModalFollows = useCallback(() => {
        setModalType(false);
    }, []);

    const handleOpenPost = (userId, postId) => {
        console.log('Post opened');
        const openPostData = { userId, postId, loggedInUserID };
        console.log('handle open post', loggedInUserID)
        navigation.navigate('PostScreen', openPostData);
    }

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
        >
            <SafeAreaView style={styles.fullPage}>

                <StatusBar barStyle="dark-content" />

                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                {/* Top Area */}
                <View style={styles.topAreaContainer}>

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.leftSideHeader}>
                            <Text style={styles.usernameFont}>{userContent.username} </Text>
                        </View>
                        <View style={styles.rightSideHeader}>
                            <TouchableOpacity onPress={handleSettingsButton}>
                                <MaterialIcons name="menu" size={30} color="black" />
                                    {modalSettings === true && (
                                        <Modal
                                            animationType="slide"
                                            transparent={true}
                                            visible={modalSettings === true}
                                            onRequestClose={closeModal}
                                        >
                                            <View style={styles.modalSettingsContainer}>
                                                <View style={styles.modalSettingContent}>
                                                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                                                        <Feather name="x" size={24} color="black" />
                                                    </TouchableOpacity>
                                                    <Text style={styles.modalSettingTitle}>Settings</Text>
                                                    <TouchableOpacity onPress={handleEditProfile}>
                                                        <Text style={{ fontSize: 15, textAlign: 'center', marginBottom: 15, marginTop:5 }}>
                                                            Edit Profile
                                                        </Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={handleLogOut}>
                                                        <Text style={{ fontSize: 15, textAlign: 'center', marginTop:5 }}>
                                                            Log out
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </Modal>
                                    )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Profile Info */}
                    <View style={styles.profileInfo}>

                        {/* Profile Picture Left Side */}
                        <View style={styles.profilePicArea}>
                            <Image 
                                style={styles.profilePic}
                                source={{ uri:userContent.profilePic} }
                            />
                        </View>

                        {/* Profile Info Right Side */}
                        <View style={styles.profileInfoRightSide}>
                            <View style={styles.userFollowing}>
                                <View style={styles.posts}>
                                    <Text  style={styles.headerText}>{userContent.posts.length}</Text>
                                    <Text  style={styles.headerText}>Posts</Text>
                                </View>
                                <TouchableOpacity style={styles.followers} onPress={handleFollowers}>
                                    <Text style={styles.headerText}>{userContent.followers.length}</Text>
                                    <Text style={styles.headerText}>Followers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.following} onPress={handleFollowing}>
                                    <Text  style={styles.headerText}>{userContent.following.length}</Text>
                                    <Text  style={styles.headerText}>Following</Text>
                                </TouchableOpacity>

                                </View>
                                {loggedInUserID !== accessedProfileUserID && (
                                    <View style={styles.buttons}>
                                    
                                            <FullWidthButton text="Follow"/>
                                            <FullWidthButton text="Message" />
                                
                                    </View>
                                )}
                                </View>

                    </View>

                    <View style={styles.bioArea}>
                        <Text style={styles.bio}>{userContent.bio}</Text>
                    </View>

                </View>

                {/* Followers and Following Displaying */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalType !== false}
                    onRequestClose={closeModalFollows}
                >
                    <View style={styles.modalFollowsContainer}>
                        <View style={styles.modalFollowContent}>
                            <TouchableOpacity onPress={closeModalFollows} style={styles.closeButton}>
                                <Feather name="x" size={24} color="black" />
                            </TouchableOpacity>
                            <Text style={styles.modalFollowTitle}>{modalType}</Text>
                            {modalType === 'followers' && (<Likes likes={userContent.followers} />)}
                            {modalType === 'following' && (<Likes likes={userContent.following} />)}
                            
                        </View>
                    </View>
                </Modal>


                {/* Content Area */}
                <View style={styles.contentAreaContainer}>
                    {Array.from({ length: postsRowsNo }).map((_, indexRow) => (
                        <View key={indexRow} style={styles.postsRows}>
                           
                        
                           {userContent.posts.slice(indexRow * 3, indexRow * 3 + 3).map((post, index) => (
                                <View key={post.postId} style={styles.post}>
                                    <View style={styles.postPictureArea}>
                                        <TouchableOpacity onPress={() => handleOpenPost(userContent.userId, post.postId)}>
                                            <Image
                                                style={styles.postImage}
                                                source={{ uri: post.postImage }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}



                        </View>
                    ))}
                </View>
                </ScrollView>
                <Footer navigation={navigation} loggedInUserID={loggedInUserID} />
                
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}
const { width } = Dimensions.get('window'); 

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
      },
      fullPage: {
        flex: 1,
        backgroundColor: '#fff',
      },
    topAreaContainer: {
        flex: 0.35,
        borderBottomWidth: 0.4, 
        borderColor: '#d3d3d3',
    },
    contentAreaContainer: {
        flex: 0.65,
    },
    header: {
        flex: 0.20,
        flexDirection: 'row',
        borderBottomWidth: 0.4, 
        borderColor: '#d3d3d3',
    },
    leftSideHeader: {
        flex: 0.9,
        justifyContent: 'center',
    },
    usernameFont: {
        fontSize: 25,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    rightSideHeader: {
        flex: 0.1,
        justifyContent: 'center',
    },
    profileInfo: {
        flex: 0.60,
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    profilePicArea: {
        flex: 0.35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: 'lightcoral',
    },
    profileInfoRightSide: {
        flex: 0.65,
        flexDirection: 'rows',
        // justifyContent: 'space-around',
        alignItems: 'center',
    },
    userFollowing: {
        flex: 0.65,
        flexDirection: 'row',  
        alignItems: 'center', 
    },
    headerText: {
        justifyContent: 'center',
        alignItems: 'center', 
        fontWeight: 'bold',
    },
    buttons: {
        flex: 0.5,
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    posts: {
        flex: 0.33,
        justifyContent: 'center',
        alignItems: 'center', 

    },
    following: {
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 0.33,
    },
    followers: {
        justifyContent: 'center',
        alignItems: 'center', 
        flex: 0.33,
    },

    bioArea: {
        flex: 0.2,
        justifyContent: 'center',
        marginLeft: 15,
        marginBottom: 10,
        marginTop: 10,
    },
    bio: {
        fontSize: 15,
    },


    // Modal Follows
    modalFollowsContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalFollowContent: {
        width: '100%',
        height: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalFollowTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20,
    },

    // Settings Modal
    modalSettingsContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    modalSettingContent: {
        width: '100%',
        height: '20%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalSettingTitle: {
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

    // Posts
    postsRows: {
        flexDirection: 'row',
        width: '100%',
        height: width / 3,
        borderBlockColor: '#d3d3d3',
        borderBlockWidth: 1,
    },
    post: {
        width: '33.33%',
        margin: 0.5,
    },
    postPictureArea: {
        width: '100%',
        height: '100%',
    },
    postImage: {
        width: '100%',
        height: '100%',
    },

});
