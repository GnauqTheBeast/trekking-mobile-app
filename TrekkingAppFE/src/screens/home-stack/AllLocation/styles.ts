import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
        backgroundColor: '#F2F2F2'
    },
    header: {
        paddingTop: 5,
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    titleText: {
        color: 'black',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 18,
    },
    listLocation: {
        paddingHorizontal: 15,
        marginTop: 10 ,
        gap: 10
    },
    wrapper: {
        height: 150,
        width: '100%',
        borderRadius: 15,
        overflow: 'hidden'
    },
    image: {
        resizeMode: "cover",
        height: '100%',
        width: '100%',
    },
    numberTrek: {
        color: 'black',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 13,
        letterSpacing: 0.5,
        backgroundColor: 'white',
        position: 'absolute',
        top: 6,
        left: 10,
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5
    },
    nameContainer: {
        width: '60%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    nameText: {
        color: 'white',
        fontFamily: 'OpenSans-Bold',
        fontSize: 16,
        letterSpacing: 0.5
    }
})

export default styles;