import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingVertical: 16,
        backgroundColor: 'white',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold'
    },
    contentContainer: {
        paddingTop: 16,
        backgroundColor: '#f2f2f2',
        flex: 1
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E1F2DC',
        paddingHorizontal: 16,
        marginBottom: 10,
        height: 45,
    },
    passwordInput: {
        flex: 1,
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        color: 'black',
    },
    buttonContainer: {
        backgroundColor: '#8E8E8E',
        opacity: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 16,
        marginTop: 16
    },
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Bold',
        fontSize: 18
    }
});

export default styles;