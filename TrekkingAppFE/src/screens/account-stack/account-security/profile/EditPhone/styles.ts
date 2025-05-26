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
    saveButton: {
        position: 'absolute',
        right: 16,
        top: 16
    },
    saveButtonText: {
        fontSize: 17,
        fontFamily: 'OpenSans-Medium',
        color: '#FF8E4F',
    },
    contentContainer: {
        paddingTop: 16,
        backgroundColor: '#f2f2f2',
        flex: 1
    },
    nameInput: {
      backgroundColor: '#E1F2DC',
      color: '#3C3E3B',
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 17,
      fontFamily: 'OpenSans-Medium',
      marginBottom: 4,
    },
    characterLimit: {
      fontSize: 13,
      fontFamily: 'OpenSans-Regular',
      color: '#8E8E93',
      textAlign: 'left',
      marginLeft: 10
    },
});

export default styles;