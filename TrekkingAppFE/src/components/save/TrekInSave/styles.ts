import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        borderColor: '#E2E2E2',
        borderWidth: 1,
        paddingBottom: 3,
        marginBottom: 12
    },
    wrapper: {
        height: 140,
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
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    nameText: {
        color: '#2A5848',
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
    },
    commonContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    commonText: {
        fontFamily: 'OpenSans-Medium',
        fontSize: 13,
        marginLeft: 5
    },
    priceText: {
        color: '#FF8E4F',
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        position: 'absolute',
        bottom: 5,
        right: 15,
    },
    wrapHostAvatar: {
        backgroundColor: '#2A5848',
        justifyContent: 'center',
        alignItems: 'center',
        width: 26,
        height: 26,
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
    },
    hostName: {
        fontFamily: 'OpenSans-Medium',
        fontSize: 11,
        position: 'absolute',
        top: 40,
        right: 10
    }
})

export default styles;