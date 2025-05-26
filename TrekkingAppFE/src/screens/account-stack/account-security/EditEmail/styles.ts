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
    emailInput: {
      backgroundColor: '#E1F2DC',
      color: '#3C3E3B',
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 17,
      fontFamily: 'OpenSans-Medium',
      marginBottom: 4,
    },
    nextButtonContainer: {
        backgroundColor: '#8E8E8E',
        opacity: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        marginHorizontal: 16,
        marginTop: 16
    },
    nextButtonText: {
        color: 'black',
        fontFamily: 'OpenSans-Bold',
        fontSize: 16
    }
});

export default styles;