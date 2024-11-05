import {StyleSheet, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function Footer() {
    return(
        <View style={styles.footer}>
           <Ionicons name="home" size={30} color="black" />
           <Ionicons name="search" size={30} color="black" />
           <FontAwesome name="plus-square-o" size={35} color="black" />
           <MaterialIcons name="movie" size={35} color="black" />
           <Ionicons name="person" size={30} color="black" />
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