import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 24,
    marginTop: '25%',
  },
  intro: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    letterSpacing: 1,
    marginBottom: '15%',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#E1F2DC',
    borderRadius: 10,
    paddingHorizontal: '5%',
    marginBottom: '5%',
    fontSize: 16,
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F2DC',
    borderRadius: 10,
    paddingHorizontal: '5%',
    marginBottom: '5%',
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },

  signupButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#FF8E4F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '6%',
    marginBottom: '14%',
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    letterSpacing: 5,
    color: 'white',
  },

  otherSignUpTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3%',
  },
  otherSignUpDecorate: {
    width: '32%',
    height: 1,
    backgroundColor: '#979797'
  },
  otherSignUpTitle: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545'
  },
  otherSignUp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 55,
    marginBottom: '25%',
  },
  otherSignUpIconContainer: {
    width: '27%',
    height: '100%',
    borderWidth: 1,
    borderColor: '#BCBABA',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#039A09',
    shadowRadius: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  otherSignUpIcon: {
    width: '35%',
    resizeMode: 'contain',
  },

  textContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  text1: {
    fontFamily: 'OpenSans-SemiBold',
    letterSpacing: 1.5
  },
  text2: {
    fontFamily: 'OpenSans-Bold',
    color: '#FF8E4F',
    letterSpacing: 1.5
  }

});

export default styles;
