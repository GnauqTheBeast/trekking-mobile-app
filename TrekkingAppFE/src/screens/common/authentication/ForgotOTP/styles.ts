import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  wrapper: {
    flex: 1,
  },
  header: {
    marginTop: 45,
    paddingTop: 5,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold'
  },
  content: {
    flex: 1,
    marginTop: 100
  },
  messageContainer: {
    paddingHorizontal: 16,
    marginBottom: 32,
    alignItems: 'center'
  },
  messageTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans-SemiBold',
    marginBottom: 8,
  },
  messageSubtitle: {
    fontFamily: 'OpenSans-Regular',
    color: '#6B7280',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#2A5848',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    backgroundColor: '#E1F2DC'
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  timerText: {
    fontFamily: 'OpenSans-Medium',
    color: '#6B7280',
  },
  resendText: {
    color: '#FF8E4F',
    fontSize: 16,
    fontFamily: 'OpenSans-Bold',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    fontFamily: 'OpenSans-Medium'
  },
  verifyButton: {
    backgroundColor: '#FF8E4F',
    borderRadius: 8,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginTop: 30
  },
  verifyButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
    fontSize: 16,
  },
});
export default styles;