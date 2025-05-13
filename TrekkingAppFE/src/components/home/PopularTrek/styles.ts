import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        height: 200,
        width: 290,
        alignItems: 'center'
    },
    wrapper: {
        height: '80%',
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        resizeMode: "cover",
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    containerLevelAndSave: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginTop: 5
    },
    levelContainer: {
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 1.5,
    },
    levelText: {
        color: 'white',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 13
    },
    content: {
        width: '90%',
        borderRadius: 10,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    nameText: {
        color: '#2A5848',
        fontFamily: 'OpenSans-Bold',
        fontSize: 14,
    },
    commonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    commonText: {
        fontFamily: 'OpenSans-Medium',
        fontSize: 12,
        marginLeft: 5
    },
    priceText: {
        color: '#FF8E4F',
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        position: 'absolute',
        bottom: 5,
        right: 10,
    },
    wrapHostAvatar: {
        backgroundColor: '#2A5848',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 50,
        overflow: 'hidden',
        position: 'absolute',
        top: 10,
        right: 10
    },
    hostAvt: {
        height: '100%',
        width: '100%',
        resizeMode: 'cover'
    }
})

export default styles;