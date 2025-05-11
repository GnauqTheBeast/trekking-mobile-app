import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      margin: 10,
      padding: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 1000,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: 12,
    },
    textContainer: {
      flex: 1,
    },
    title: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
    },
    message: {
      color: '#FFF',
      opacity: 0.9,
      fontSize: 14,
    },
    closeButton: {
      padding: 4,
    },
  });

  export default styles;