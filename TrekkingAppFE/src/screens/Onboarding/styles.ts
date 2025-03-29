import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center'
    },
    overlay: {
        width: '100%',
        height: '40%',
        position: 'absolute',
        bottom: 0,
    },
    container: {
        marginTop: '25%',
        alignItems: 'center',
    },
    title: {
        color: 'white',
        fontFamily: 'OpenSans-Bold',
        fontSize: 22,
    },
    intro: {
        color: 'white',
        fontFamily: 'OpenSans-Regular',
        fontSize: 14,
        marginBottom: '10%'
    },
    btnStart: {
        width: '80%',
        height: 46,
        backgroundColor: '#1F9935',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0
    },
    textButton: {
        color: 'white',
        padding: 0,
        fontFamily: 'OpenSans-SemiBold',
        fontSize: 16
    }
});

export default styles;