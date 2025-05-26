import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    content: {
      flex: 1,
      backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        marginTop: 45,
        marginBottom: 10
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'OpenSans-Bold'
    },
    headerX: {
        flexDirection: 'row',
        backgroundColor: '#2A5848',
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 10,
        height: 70,
    },
    textTitle: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 16,
        color: 'white'
    },
    money: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18,
        color: 'white'
    },
    menuContainer: {
      backgroundColor: '#fff',
      marginBottom: 16,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F2F2F2',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      marginLeft: 16,
      fontSize: 15,
      fontFamily: 'OpenSans-Medium',
      color: 'black',
    },
  });

export default styles;