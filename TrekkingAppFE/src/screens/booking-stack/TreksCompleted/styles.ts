import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
  },
  trekList: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  trekListContent: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  noContainer: {
    alignItems: 'center',
    marginTop: 56
  },
  title: {
    fontSize: 18,
    fontFamily: 'OpenSans-Bold',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'OpenSans-Regular',
    marginBottom: 32,
    width: '80%',
    textAlign: 'center'
  },
  loginButtonText: {
    backgroundColor: '#2A5848',
    color: 'white',
    fontFamily: 'OpenSans-Bold',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6
  }
});

export default styles;