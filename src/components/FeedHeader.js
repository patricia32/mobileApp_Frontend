import {StyleSheet, View, Text} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import MaterialComunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FeedHeader() {
    return(
        <View style={styles.header}>
            <View style={styles.left}>
                <Text style={styles.text}>For you</Text>
            </View>

            <View style={styles.right}>
                <MaterialComunityIcons name="cards-heart-outline" size={25} color="black" style={styles.icon}/>
                <Feather name="send" size={25} color="black" style={styles.icon} />
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        height: 50,
        width: '100%',
        justifyContent: 'space-between',
        
        alignItems: 'center',
        borderBottomWidth: 0.4, 
        borderColor: '#d3d3d3',
    },
    left: {
        marginLeft: 25,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    right: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icon: {
        marginRight: 20,
    },

    text: {
        fontSize: 30,
        fontWeight: 'bold',
    },

});