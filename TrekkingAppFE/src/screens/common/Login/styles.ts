import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  logoContainer: {
    width: 200,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30%',
    marginBottom: '10%',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    fontFamily: 'OpenSans-ExtraBold',
    fontSize: 22,
  },
  intro: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 18,
    letterSpacing: 1,
    marginBottom: '10%',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#E1F2DC',
    borderRadius: 10,
    paddingHorizontal: 15,
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
    height: 50,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: '3%',
    marginBottom: '8%',
  },
  forgotPasswordText: {
    color: 'black',
    fontFamily: 'OpenSans-Regular',
    fontSize: 14,
    textAlign: 'right',
  },

  loginButton: {
    width: '100%',
    height: 45,
    backgroundColor: '#FF8E4F',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '15%',
  },
  buttonText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
    letterSpacing: 5,
    color: 'white',
  },

  otherLoginTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '3%',
  },
  otherLoginDecorate: {
    width: '32%',
    height: 1,
    backgroundColor: '#979797'
  },
  otherLoginTitle: {
    fontFamily: 'OpenSans-Regular',
    color: '#454545'
  },
  otherLogin: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 55,
    marginBottom: '30%',
  },
  otherLoginIconContainer: {
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
  otherLoginIcon: {
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
