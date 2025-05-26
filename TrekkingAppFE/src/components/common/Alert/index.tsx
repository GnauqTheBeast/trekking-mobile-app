import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

type CustomAlertProps = {
  visible: boolean;
  message: string;
  onClose: () => void
};

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, message, onClose }) => {
  useEffect(() => {
      let timeout: NodeJS.Timeout;

      if(visible) {
          timeout = setTimeout(() => {
              onClose()
          }, 1500)
      }

      return () => clearTimeout(timeout)
  }, [visible, onClose])

  return (
      <Modal
          onBackdropPress={onClose}
          isVisible={visible}
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={100}
          animationOutTiming={400}
          backdropTransitionOutTiming={0}
      >
          <View style={styles.modalContainer}>
              <Icon name='error-outline' size={36} color={'red'}/>
              <Text style={styles.message}>{message}</Text>
          </View>
      </Modal>
  )
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1000
  },
  message: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomAlert;
