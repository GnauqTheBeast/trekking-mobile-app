import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#2A5848'
    },
    content: {
      marginTop: 40,
      flex: 1,
      backgroundColor: 'white'
    },
    header: {
      flexDirection: 'row',
      backgroundColor: '#2A5848',
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
      height: 100
    },
    profileImageContainer: {
      marginRight: 20,
    },
    profileImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#F2F2F2',
      alignItems: 'center',
      justifyContent: 'center'
    },
    profileInfo: {
      flex: 1,
    },
    profileName: {
      fontSize: 18,
      fontFamily: 'OpenSans-Bold',
      color: 'white'
    },
    profileEmail: {
      fontSize: 14,
      fontFamily: 'OpenSans-Medium',
      color: '#cccccc',
      marginTop: 2,
    },
    noLoginContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    introText: {
        color: 'white',
        fontFamily: 'OpenSans-Medium',
        marginBottom: 10
    },
    authContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    authTextContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'white',
        paddingVertical: 3,
        width: '30%'
    },
    authText: {
        fontFamily: 'OpenSans-Bold',
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
    // Logout
    logoutButton: {
      flexDirection: 'row',
      backgroundColor: '#2A5848',
      marginHorizontal: 16,
      marginTop: 40,
      paddingVertical: 12,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',

    },
    logoutText: {
      marginLeft: 10,
      fontSize: 16,
      color: 'white',
      fontFamily: 'OpenSans-Bold'
    },

  });

export default styles;