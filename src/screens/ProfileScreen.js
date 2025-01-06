import { Dimensions, SafeAreaView, ScrollView, StyleSheet, onPress, Text, KeyboardAvoidingView, StatusBar, Platform, View, Image, TouchableOpacity, Modal, Button } from "react-native";
import React, {useCallback, useRef, useState, useEffect} from "react";
import Footer from "../components/Footer";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import UsersList from "../components/UsersList";
import LoadingScreen from "./LoadingScreen";
import ErrorScreen from "./ErrorScreen";



export default function  ProfileScreen({ navigation, route }) {
    const { loggedInUserID, accessedProfileUserID } = route.params;
    let currentProfileUsername = ''; 
        if(loggedInUserID === accessedProfileUserID || accessedProfileUserID === undefined)
            currentProfileUsername = loggedInUserID;
        else
        currentProfileUsername = accessedProfileUserID;

    console.log('Profile Screen rendering ', loggedInUserID, accessedProfileUserID);

    const [userContent, setUserContent] = useState(null);
    const [userFollowingListLength, setUserFollowingListLength] = useState(null);
    const [userFollowersListLength, setUserFollowersListLength] = useState(null); 
    const [following, setFollowing] = useState(false); 


    const [posts, setPosts] = useState(null);


    const [loading, setLoading] = useState(true);
    const [loadingFollow, setLoadingFollow] = useState(true);

    const [error, setError] = useState(null);


    const fetchUserProfile = async () => {
        

        console.log('fetchUserProfile ', currentProfileUsername);
        // Fetch user profile data from the server
        try {
            const response = await fetch(`http://192.168.1.129:5000/getUserProfile?username=${currentProfileUsername}`);
            const data = await response.json();
    
            if (response.ok) {
                setUserContent(data);  

                // Fetch user's following list length 
                try {
                    const response = await fetch(`http://192.168.1.129:5000/getUserFollowingListLength?username=${currentProfileUsername}`);
                    const dataFollowing = await response.json();

                    if (response.ok)
                        setUserFollowingListLength(dataFollowing.followingListLength);
                    else
                        setError(dataFollowing.error || 'An error occurred');

                } catch (err) {
                    setError('Network error');
                }

                // Fetch user's followers list length
                try {
                    const response = await fetch(`http://192.168.1.129:5000/getUserFollowersListLength?username=${currentProfileUsername}`);
                    const dataFollowers = await response.json();

                    if (response.ok)
                        setUserFollowersListLength(dataFollowers.followersListLength);
                    else
                        setError(dataFollowers.error || 'An error occurred');

                } catch (err) {
                    setError('Network error');
                }


                // Fetch user posts data from the server
                try {
                    const response = await fetch(`http://192.168.1.129:5000/getUserPosts_id_and_photoPath?username=${currentProfileUsername}`);
                    const dataPosts = await response.json();
        
                    if (response.ok) 
                        setPosts(dataPosts);  
                    else 
                        setError(dataPosts.error || 'An error occurred');  
                
                } catch (err) {
                    setError('Network error');  
                }
                
            } else 
                setError(data.error || 'An error occurred');  
            
        } catch (err) {
            setError('Network error'); 
        } finally {
            setLoading(false);  
        }
    };

    const checkFollowing = async () =>{
        if(loggedInUserID === accessedProfileUserID) return;
        setLoadingFollow(true);
        try {
            const response = await fetch(`http://192.168.1.129:5000/user/checkFollowing?usernameFollowing=${loggedInUserID}&usernameFollowed=${accessedProfileUserID}`);
            const data = await response.json();

            if (response.ok) 
                setFollowing(data);
            
            else
                setError(data.error || 'An error occurred');

        } catch (err) {
            setError('Network error');
        } finally {
            console.log("is following", following)
            setLoadingFollow(false);
        }
    }
    
    useEffect(() => {
        fetchUserProfile();
        checkFollowing();
    }, [currentProfileUsername]);  
    

    const scrollViewRef = useRef(null);
    const [modalSettings, setModalSettings] = React.useState(false);
    const [modalType, setModalType] = React.useState(false); // followers and following
    

    const handleSettingsButton = () => {
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

    // Fetch followers list
    const handleFollowers = async () => {
        setModalType('followers')
    };

    // Fetch following list
    const handleFollowing = async () => {
        setModalType('following')
    };

    const handleToggleFollowButton = async () => {
        setLoading(true);
    
        try {
            let response;
            console.log("last check", following);
            
            //API call based on the current follow status
            if (following) { // unfollow
                response = await fetch(`http://192.168.1.129:5000/user/unFollow`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usernameFollowing: loggedInUserID,
                        usernameFollowed: accessedProfileUserID,
                }),
            });

           } else { // follow
                response = await fetch(`http://192.168.1.129:5000/user/follow`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usernameFollowing: loggedInUserID,
                        usernameFollowed: accessedProfileUserID,
                    }),
                });
           }
    
            const data = await response.json();
    
            // If the API call was successful, toggle the 'following' state
            if (response.ok) 
                setFollowing(prevFollowing => !prevFollowing);
            else 
                setError(data.error || 'An error occurred');
    
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const closeModalFollows = useCallback(() => {
        setModalType(false);
    }, []);

    const handleOpenPost = (username, postID) => {
        const openPostData = { username, postID, loggedInUserID };
        navigation.navigate('PostScreen', openPostData);
    }
    
    if (loading || loadingFollow) return <LoadingScreen/>;
    if (error) return <ErrorScreen error={error} onGoBack={() => navigation.goBack()} />;

    
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
                                source={{ uri:userContent.profilePicPath} }
                            />
                        </View>

                        {/* Profile Info Right Side */}
                        <View style={styles.profileInfoRightSide}>
                            <View style={styles.userFollowing}>
                                <View style={styles.posts}>
                                    <Text  style={styles.headerText}>{posts.length}</Text>
                                    <Text  style={styles.headerText}>Posts</Text>
                                </View>
                                <TouchableOpacity style={styles.followers} onPress={() => setModalType('followers')}>
                                    <Text style={styles.headerText}>{userFollowersListLength}</Text>
                                    <Text style={styles.headerText}>Followers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.following} onPress={() => setModalType('following')}>
                                    <Text  style={styles.headerText}>{userFollowingListLength}</Text>
                                    <Text  style={styles.headerText}>Following</Text>
                                </TouchableOpacity>

                            </View>
                                
                            <View>
                                {loggedInUserID !== accessedProfileUserID && (
                                    <View style={styles.buttons}>
                                        <TouchableOpacity 
                                            style={[
                                                styles.button, 
                                                { backgroundColor: following ? 'rgb(220, 220, 220)': 'rgb(0, 149, 246)' }
                                            ]}                                             
                                           onPress={() => handleToggleFollowButton()}
                                            >
                                            <Text style={styles.buttonText}>
                                                {following  ? 'Unfollow' : 'Follow'}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.button} onPress={onPress}>
                                            <Text style={styles.buttonText}>Message</Text>
                                        </TouchableOpacity>
                                    </View>
                                    )}
                            </View>
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

                                { modalType === 'following' && (
                                    
                                    <UsersList
                                        navigation={navigation}
                                        route={{ params: { loggedInUserID } }} 
                                        closeModal={closeModalFollows} 
                                        usersListType={'following'}
                                        userToGetData={currentProfileUsername}
                                    />
                                )}

                                { modalType === 'followers' && (
                                    <UsersList
                                        navigation={navigation}
                                        route={{ params: { loggedInUserID } }} 
                                        closeModal={closeModalFollows} 
                                        usersListType={'followers'}
                                        userToGetData={currentProfileUsername}                                    />
                                )}
                        </View>
                    </View>
                </Modal>


                {/* Content Area */}
                <View style={styles.contentAreaContainer}>
                    {Array.from({ length: Math.ceil(posts.length / 3) }).map((_, indexRow) => (
                        
                        <View key={indexRow} style={styles.postsRows}>
                        
                           {posts.slice(indexRow * 3, indexRow * 3 + 3).map((post, index) => (
                                <View key={post.postId} style={styles.post}>
                                    <View style={styles.postPictureArea}>
                                        <TouchableOpacity onPress={() => handleOpenPost(userContent.username, post.postID)}>
                                            <Image
                                                style={styles.postImage}
                                                source={{ uri: post.postPhotoPath }}
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
        marginTop: 7,
        borderRadius: 60,
        backgroundColor: 'lightcoral',
    },
    profileInfoRightSide: {
        flex: 0.65,
        flexDirection: 'rows',
        alignItems: 'center',
    },
    userFollowing: {
        marginTop: 20,
        flex: 0.65,
        marginRight: 10,
        flexDirection: 'row',  
        alignItems: 'center', 
    },
    headerText: {
        justifyContent: 'center',
        alignItems: 'center', 
        fontWeight: 'bold',
    },
    buttons: {
        flex: 0.35, 
        width: '55%',
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end',

    },
    button: {
        width: '80%', 
        height: 35,
        backgroundColor: 'rgb(220, 220, 220)',
        borderRadius: 5,
        marginRight: 10,
        marginTop: 10,
        justifyContent: 'center',
        alignSelf: 'center',
      },
      buttonText: {
        color: 'black',
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
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
