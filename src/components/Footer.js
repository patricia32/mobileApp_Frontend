import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Footer({navigation}) {
    return(
        <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Feed')}>
                <Ionicons name="home" size={30} color="black" />
            </TouchableOpacity>
            <Ionicons name="search" size={30} color="black" />
            <FontAwesome name="plus-square-o" size={35} color="black" />
            <MaterialIcons name="movie" size={35} color="black" />
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
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
        borderTopWidth: 0.4,  // Changed from topborderWidth to borderTopWidth
        borderColor: '#d3d3d3',
    }
});