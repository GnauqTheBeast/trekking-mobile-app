import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    container: {
      flex: 1,
      backgroundColor: '#F2F2F2',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      marginBottom: 8,
      backgroundColor: 'white',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'OpenSans-Bold',
      flex: 1,
      textAlign: 'center'
    },
    counterContainer: {
      backgroundColor: '#FF8E4F',
      borderRadius: '50%',
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      right: 95
    },
    counterText: {
      fontSize: 14,
      color: 'white',
      fontFamily:'OpenSans-ExtraBold',
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      right: 10
    },
    actionButton: {
      padding: 8,
      marginLeft: 16,
    },
    readAllTextContainer: {
      alignItems: 'flex-end',
      backgroundColor: '#F2F2F2',
      padding: 4,
      marginRight: 8
    },
    readAllText: {
      color: '#8E8E8E',
      fontFamily: 'OpenSans-Medium'
    },


  });

export default styles;