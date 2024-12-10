import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Footer({navigation, loggedInUserID}) {
    return(
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Feed', {loggedInUserID})}>
                <Ionicons name="home" size={30} color="black" />
            </TouchableOpacity>
            <Ionicons name="search" size={30} color="black" />
            <FontAwesome name="plus-square-o" size={35} color="black" />
            <Ionicons name="heart" size={35} color="black" />
            <TouchableOpacity onPress={() => navigation.navigate('Profile', {loggedInUserID, accessedProfileUserID: loggedInUserID})}>
                <Ionicons name="person" size={30} color="black" />
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    footer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 50,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopWidth: 0.4, 
        borderColor: '#d3d3d3',
    }
});